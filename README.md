# ai-tutor-studio

client 실행 명령어

npm start

server 실행 명령어

python -m uvicorn main:app --reload



데이터 변환 과정
1. 스크립트 데이터 업로드
2. 스크립트 데이터를 데이터셋으로 변환 <- 여기서 필요한 프롬프트 등은 데이터베이스에서 가져와서 적용
3. 변환된 데이터셋을 검수하는 화면에 노출
4. 검수가 완료되면 데이터베이스에 저장
