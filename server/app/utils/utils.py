from app.core.config import settings
import openai
import json

# DB에서 가져온 데이터셋을 파인튜닝용으로 변환
def convert_dataset_to_finetuning(dataset):
    # 시스템 프롬프트 생성
    system_prompt = json.dumps({**dataset['instructor_profile'], **dataset['learning_content']}, ensure_ascii=False)
    
    # 메시지 리스트 생성
    jsonl_data = []
    
    # 시스템 프롬프트를 포함한 기본 메시지
    base_messages = [{"role": "system", "content": system_prompt}]
    
    for example in dataset['example_sentences']:
        messages = base_messages.copy()
        messages.append({"role": "user", "content": example['input']})
        messages.append({"role": "assistant", "content": example['output']})
        jsonl_data.append(json.dumps({"messages": messages}, ensure_ascii=False))
    
    return "\n".join(jsonl_data)

