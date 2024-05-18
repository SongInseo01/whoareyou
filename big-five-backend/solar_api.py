import os
from pydantic import BaseModel
from fastapi import APIRouter, FastAPI, HTTPException
from openai import OpenAI
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from langchain_upstage import UpstageLayoutAnalysisLoader
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_upstage import ChatUpstage

load_dotenv()
UPSTAGE_API_KEY = os.getenv("UPSTAGE_API_KEY")
pdf_path = os.path.join(os.path.dirname(__file__), "bigfive.pdf")
layzer = UpstageLayoutAnalysisLoader(pdf_path, output_type="html", api_key=UPSTAGE_API_KEY)
docs = layzer.load()

llm = ChatUpstage(api_key=UPSTAGE_API_KEY)

prompt_template = PromptTemplate.from_template(
    """
    Please provide most correct answer from the following context. 
    Think step by step and look the html tags and table values carefully to provide the most correct answer.
    If the answer is not present in the context, please write "The information is not present in the context."
    ---
    Question: {question}
    ---
    Context: {context}
    """
)
chain = prompt_template | llm | StrOutputParser()

class BigFiveEvaluation(BaseModel):
    extraversion: str
    neuroticism: str
    conscientiousness: str
    agreeableness: str
    openness: str

load_dotenv()

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# OpenAI 클라이언트 설정
client = OpenAI(
    api_key=os.environ["UPSTAGE_API_KEY"], base_url="https://api.upstage.ai/v1/solar"
)

@app.post("/qa")
def read_root(item: BigFiveEvaluation):
    # LangChain을 사용하여 PDF 문맥에서 답변 추출
    try:
        context_result = chain.invoke({
            "question": "How to interpret Big Five personality traits?",
            "context": docs
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LangChain 처리 중 오류 발생: {str(e)}")

    # OpenAI API를 사용하여 추가적인 답변 생성
    try:
        chat_result = client.chat.completions.create(
            model="solar-1-mini-chat",
            messages=[
                {"role": "system", "content": f"""
                I recently received the results of the Big Five personality traits test. Extraversion {item.extraversion},
                Neuroticism is {item.neuroticism}, conscientiousness is {item.conscientiousness},
                Agreeableness is {item.agreeableness}, and openness is {item.openness}.
                But I don't know how to interpret this result.
                Give me specific suggestions to improve my life in a positive way by capitalizing on the strengths of each personality factor and complementing my weaknesses.
                I want to know myself well, so I would like you to provide a summary and a detailed interpretation of each factor.
                Could you please give me an example that clearly shows my five tendencies?
                I'm worried about whether I'm doing well because the results are different from the direction I'm aiming for.
                Remove duplicate or similar content and say it only once.
                I want to know how the Big Five personality traits test results affect social life or work.
                While interpreting, let me know if there is anything you don't understand or if you have any additional questions.
                If there are similar contents in your answers, please shorten them so that they are as easy to read as possible.
                """},
            ],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI 처리 중 오류 발생: {str(e)}")

    # 최종 응답 결합
    final_response = {
        "context_response": context_result,
        "chat_response": chat_result.choices[0].message.content
    }

    return final_response

@app.post("/qa/combined")
def combined_qa(item: BigFiveEvaluation):
    # LangChain을 사용하여 PDF 문맥에서 답변 추출
    try:
        context_result = chain.invoke({
            "question": "How to interpret Big Five personality traits?",
            "context": docs
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LangChain 처리 중 오류 발생: {str(e)}")

    # OpenAI API를 사용하여 추가적인 답변 생성
    try:
        chat_result = client.chat.completions.create(
            model="solar-1-mini-chat",
            messages=[
                {"role": "system", "content": f"""
                I recently received the results of the Big Five personality traits test. Extraversion {item.extraversion},
                Neuroticism is {item.neuroticism}, conscientiousness is {item.conscientiousness},
                Agreeableness is {item.agreeableness}, and openness is {item.openness}.
                But I don't know how to interpret this result.
                Give me specific suggestions to improve my life in a positive way by capitalizing on the strengths of each personality factor and complementing my weaknesses.
                I want to know myself well, so I would like you to provide a summary and a detailed interpretation of each factor.
                Could you please give me an example that clearly shows my five tendencies?
                I'm worried about whether I'm doing well because the results are different from the direction I'm aiming for.
                Remove duplicate or similar content and say it only once.
                I want to know how the Big Five personality traits test results affect social life or work.
                While interpreting, let me know if there is anything you don't understand or if you have any additional questions.
                If there are similar contents in your answers, please shorten them so that they are as easy to read as possible.
                """},
            ],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI 처리 중 오류 발생: {str(e)}")

    # context_response와 chat_response를 결합하여 새로운 요청 생성
    combined_response = f"""
    Context Response: {context_result}

    Chat Response: {chat_result.choices[0].message.content}

    Please combine the above context response and chat response into a cohesive summary and interpretation.
    Remove duplicate or similar content and say it only once.
    I want to know how the Big Five personality traits test results affect social life or work.
    While interpreting, let me know if there is anything you don't understand or if you have any additional questions.
    If there are similar contents in your answers, please shorten them so that they are as easy to read as possible.
    """

    try:
        final_result = client.chat.completions.create(
            model="solar-1-mini-chat",
            messages=[
                {"role": "system", "content": combined_response}
            ],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI 처리 중 오류 발생: {str(e)}")

    return {"final_response": final_result.choices[0].message.content}

# 서버 실행 (uvicorn을 사용하여 서버를 실행)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
