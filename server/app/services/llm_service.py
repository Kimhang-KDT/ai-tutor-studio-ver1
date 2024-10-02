from app.core.config import settings
import openai
import json
from fastapi import UploadFile

categorize_system_prompt = """
너의 역할은 교육용 데이터를 바탕으로 그 데이터에 맞게끔 LLM에게 교육 목차를 분류해주는 데이터 셋을 제공하고, 강사의 스타일에 맞는 파인튜닝 데이터셋을 제공하는 것이다.
목차의 구성은 중요한 부분이기 때문에 데이터에서 목차부분의 데이터는 빠지는 내용이 있으면 안된다.
너가 텍스트를 기반으로 가공한 데이터는 다른 LLM모델이 학습하여 교육용 데이터로 사용 할 것이다.
너의 역할은 다음과 같다.

1. 입력된 데이터로 강사의 스타일에 맞는 페르소나를 만들어 새로운 모델을 위한 프롬프트를 만들어주는 역할.
    - 프롬프트 앤지니어링 역할 정의 부분은 다음과 같이 구성
        - 프롬프트 페르소나에 들어갈 부분의 텍스트(역할)를 지정해주는 부분
        - 각 강의별로 중점적으로 가르쳐야될 포인트들

데이터의 형식은 json object로 출력하고 아래의 형태로 출력
```
{
    "role": string,
    "style": string,
    "tone": string,
    "introduction": string,
    "target_audience": string[],
    "teaching_method": string[],
    "key_points": string[],
}
```

모든 데이터는 강의를 기반으로 한다.
role에는 역할을 입력.
style에는 스타일을 입력.
tone에는 강사의 성격 톤을 입력.
introduction에는 강사가 진행할 수업내용의 소개를 입력.
target_audience에는 강사가 진행할 수업내용이 도움이 될 대상을  입력 ex)초등학생, 중학생, 고등학생, 대학생, 어린이, 토익, 토플 등등.
teaching_method에는 강사가 진행할 수업내용의 교육 방법을 입력.
key_points에는 강의내용의 중점적으로 가르쳐야될 포인트들을 구체적으로 3가지를 뽑아줘



2. 입력된 데이터를 기반으로 학습용 데이터 셋을 만드는 역할.
    - 입력된 데이터를 학습용 데이터로 바꾸는 역할을 하는 LLM
    - 주제 소주제 내용과 같은 구성으로 정리 json 형식만듬.
    - 각 내용에 들어갈 주의사항은 다음과 같다.
        - 데이터를 기반으로 강사의 노하우를 최대한 반영.
        - 레벨에 맞는 강의 내용을 정리.
        - 강사가 강조하는 부분을 강조해 줘.

데이터의 형식은 json object로 출력하고 아래의 형태로 출력
{
    "categories": string[],
    "summary": string,
    "level": string,
    "explanation": string[],
    "question": string{"q": string, "a": string}[],    
    "reference": string[],
    "important_words": string{중요 단어: 이유}[],
    "important_sentences": string{중요 문장: 이유}[],
    "important_phrases": string{중요 구문: 이유}[],
}

Categories는 데이터 셋의 테마를 입력 해줘. 내용에서 가장 중요한 부분에 대해서 3개의 카테고리로 입력. ex)명사, 대명사, 동사, 형용사, 부사, 전치사, 접속사, 어미, 어간, 접미사, 문장, 문단, 문장 구조, 문장 형식, 문장 형태, 문장 형태소, 문장 형태소 구조, 문장 형태소 구조 등등.
summary는 한국어로 주요 내용을 입력.
level은 영문법 난이도를 기초, 중급, 고급 중 하나를 입력.
explanation은 한국어로 영문법 설명을 입력.
question은 영문법 문제와 정답 3개정도를 리스트에 딕셔너리로 담아서 입력.
reference는 영문법 참고 내용을 입력.
important_words는 영문법 중요 단어를 입력.
important_sentences는 영문법 중요 문장을 입력.
important_phrases는 영문법 중요 구문을 입력.

3. 2번에서 나온 데이터를 바탕으로 파인튜닝용 few-shot을 jsonl 형태로 만든다.
    - 여기서 데이터는 강사의 스타일을 참고.
    - level 별로 다르게 작성.
    - 강의의 스타일은 입력된 데이터를 바탕으로 한다.
        - 강사의 말투나, 표현 방식을 파악해서 작성.
        - 강사가 강조하는 부분을 학습하게 작성.
        - 데이터를 기반으로 강사의 노하우를 최대한 반영.
    - important_sentences와 important_phrases, important_sentences_with_english, important_phrases_with_english마다 하나씩 난이도 별로 각각 1개씩 총 12개를 작성해줘라.
"""

async def translate_data(file: UploadFile):
    # OpenAI API 키 설정
    openai.api_key = settings.LLM_API_KEY

    # 파일 내용 읽기
    content = await file.read()
    file_content = content.decode("utf-8")

    # 프롬프트 구성
    prompt = f"{categorize_system_prompt}\n\n{file_content}\n\n프롬프트, 학습용 데이터 셋, 파인튜닝용 데이터셋을 각각 작성해줘"

    try:
        # OpenAI API 호출
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini-2024-07-18",
            messages=[
                {"role": "system", "content": categorize_system_prompt},
                {"role": "user", "content": prompt}
            ]
        )

        # API 응답에서 텍스트 추출
        result = response.choices[0].message.content
        
        # 텍스트에서 JSON 데이터 추출
        json_data = extract_json_from_text(result)

        if not json_data:
            print("JSON 데이터를 추출할 수 없습니다.")
            print("원본 응답:", result)
            return {"error": "JSON 데이터를 추출할 수 없습니다."}

        # JSON 데이터를 섹션별로 구조화
        structured_data = structure_json_data(json_data)

        print("구조화된 JSON 데이터:", json.dumps(structured_data, ensure_ascii=False, indent=2))
        return structured_data

    except Exception as e:
        print(f"OpenAI API 호출 중 오류 발생: {str(e)}")
        return {"error": str(e)}

def extract_json_from_text(text):
    # 텍스트에서 JSON 데이터 추출
    json_objects = []
    start = 0
    while True:
        try:
            obj = json.loads(text[start:])
            json_objects.append(obj)
            break
        except json.JSONDecodeError as e:
            if e.pos == 0:
                start += 1
                if start >= len(text):
                    break
            else:
                try:
                    json_objects.append(json.loads(text[start:start+e.pos]))
                    start += e.pos
                except:
                    start += 1

    return json_objects if json_objects else None

def structure_json_data(json_objects):
    structured_data = {
        "instructor_profile": None,
        "learning_content": None,
        "example_sentences": []
    }

    for obj in json_objects:
        if isinstance(obj, dict):
            if "role" in obj:
                structured_data["instructor_profile"] = obj
            elif "categories" in obj:
                # 질문 부분 처리
                if "question" in obj and isinstance(obj["question"], list):
                    obj["question"] = [
                        {"q": item["q"], "a": item["a"]} 
                        for item in obj["question"] 
                        if isinstance(item, dict) and "q" in item and "a" in item
                    ]
                structured_data["learning_content"] = obj
            elif "input" in obj and "output" in obj:
                structured_data["example_sentences"].append(obj)

    return structured_data