import os
from pydantic import BaseModel
from fastapi import APIRouter, FastAPI
from openai import OpenAI

class BigFiveEvaluation(BaseModel):
    extraversion: str
    neuroticism: str
    conscientiousness: str
    agreeableness: str
    openness: str

app = FastAPI()

# OpenAI 클라이언트 설정
client = OpenAI(
    api_key=os.environ["UPSTAGE_API_KEY"], base_url="https://api.upstage.ai/v1/solar"
)

@app.post("/qa")
def read_root(item: BigFiveEvaluation):
    chat_result = client.chat.completions.create(
        model="solar-1-mini-chat",
        messages=[
            {"role": "system", "content": f"""
            최근에 Big Five personality traits 검사 결과를 받았어. 외향성(extraversion)이 {item.extraversion},
            신경성(neuroticism)이 {item.neuroticism}, 성실성(conscientiousness)이 {item.conscientiousness},
            친화성(agreeableness)이 {item.agreeableness}, 개방성(openness)이 {item.openness} 이라는 거야.
            그런데 이 결과를 어떻게 해석해야 할지 모르겠어.
            각 성격 요인별 강점을 살리고, 약점을 보완하는 긍정적인 방향으로 삶을 개선할 수 있는 구체적인 제안을 해줘.
            나에 대해 스스로 잘 알고 싶어 그래서 요약본과 각 요인별 자세하게 해석해주었으면해
            내가 지향하는 방향과 다른 결과 때문에 내가 스스로 잘 하고 있는지 걱정이 드네.
            해석을 하다가 이해되지 않은 부분이나 추가로 궁금한 것이 있다고 알려줘.
            """},
        ],
    )

    return {"desc": chat_result.choices[0].message.content}

# 서버 실행 (uvicorn을 사용하여 서버를 실행)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)