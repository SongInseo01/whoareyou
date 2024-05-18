'use client';

import {useState} from "react";
import PersonalityTestForm from "@/components/PersonalityTestForm";
import PersonalityTestReport, {IBigFive} from "@/components/PersonailtyTestReport";
import {Spin} from "antd";

export default function PersonalityTest() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showResult, setShowResult] = useState(false);
  const [bigFiveList, setBigFiveList] = useState<IBigFive[]>([]);

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      const bigFiveResult : IBigFive = {
        extraversion: calculateExtraversion(values),
        neuroticism: calculateNeuroticism(values),
        conscientiousness: calculateConscientiousness(values),
        agreeableness: calculateAgreeableness(values),
        openness: calculateOpenness(values),
      }

      const commentaryRequest = {
        extraversion: translate("", bigFiveResult.extraversion),
        neuroticism: translate("", bigFiveResult.neuroticism),
        conscientiousness: translate("", bigFiveResult.conscientiousness),
        agreeableness: translate("agreeableness", bigFiveResult.agreeableness),
        openness: translate("openness", bigFiveResult.openness),
      }

      const res = await fetch('http://localhost:8000/qa/combined', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(commentaryRequest),
      })

      const commentary = await res.json();

      bigFiveResult.commentary = commentary["final_response"];

      setBigFiveList(bigFiveList.concat([bigFiveResult]));
      setShowResult(true);
    } finally {
      setLoading(false);
    }
  }

  const calculateExtraversion = (values: any) => {
    const sum = Number(values.linePoint1) + Number(values.linePoint6);
    if (sum >= 2 && sum <= 4) {
      return 1;
    }
    if (sum >= 5 && sum <= 6) {
      return 2;
    }
    if (sum >= 7 && sum <= 8) {
      return 3;
    }
    if (sum >= 9 && sum <= 10) {
      return 4;
    }

    return 4;
  }

  const translate = (char: string, value: number) => {
    if(char === "agreeableness") {
      // 10점 이하 낮음, 11~12점 중하, 13 중상, 14~15 높음
      if (value <= 10) {
        return "낮음";
      }
      if (value >= 11 && value <= 12) {
        return "중하";
      }
      if (value == 13) {
        return "중상";
      }
      if (value >= 14 && value <= 15) {
        return "높음";
      }
      return "낮음"
    } else if(char === "openness") {
      // 8점 이하 낮음, 9~10점 중하, 11~12 중상, 13~15 높음
      if (value <= 8) {
        return "낮음";
      }
      if (value >= 9 && value <= 10) {
        return "중하";
      }
      if (value >= 11 && value <= 12) {
        return "중상";
      }
      if (value >= 13 && value <= 15) {
        return "높음";
      }
      return "낮음"
    } else {
      // 2~4 낮음, 5~6 중간, 7~8 중상, 9~10 높음
      if (value >= 2 && value <= 4) {
        return "낮음";
      }
      if (value >= 5 && value <= 6) {
        return "중간";
      }
      if (value >= 7 && value <= 8) {
        return "중상";
      }
      if (value >= 9 && value <= 10) {
        return "높음";
      }
    }

  }

  const calculateNeuroticism = (values: any) => {
    const sum = Number(values.linePoint5) + Number(values.linePoint10);
    if (sum >= 2 && sum <= 4) {
      return 1;
    }
    if (sum >= 5 && sum <= 6) {
      return 2;
    }
    if (sum >= 7 && sum <= 8) {
      return 3;
    }
    if (sum >= 9 && sum <= 10) {
      return 4;
    }

    return 4;
  }

  const calculateConscientiousness = (values: any) => {
    const sum = Number(values.linePoint4) + Number(values.linePoint9);
    if (sum >= 2 && sum <= 4) {
      return 1;
    }
    if (sum >= 5 && sum <= 6) {
      return 2;
    }
    if (sum >= 7 && sum <= 8) {
      return 3;
    }
    if (sum >= 9 && sum <= 10) {
      return 4;
    }

    return 4;
  }

  const calculateAgreeableness = (values: any) => {
    const sum = Number(values.linePoint2) + Number(values.linePoint7) + Number(values.linePoint12);
    if (sum >= 10) {
      return 1;
    }
    if (sum >= 11 && sum <= 12) {
      return 2;
    }
    if (sum == 13) {
      return 3;
    }
    if (sum >= 14 && sum <= 15) {
      return 4;
    }

    return 1;
  }

  const calculateOpenness = (values: any) => {
    const sum = Number(values.linePoint3) + Number(values.linePoint8) + Number(values.linePoint11);
    if (sum >= 8) {
      return 1;
    }
    if (sum >= 9 && sum <= 10) {
      return 2;
    }
    if (sum >= 11 && sum <= 12) {
      return 3;
    }
    if (sum >= 13 && sum <= 15) {
      return 4;
    }

    return 1;
  }

  const handleAddPerson = () => {
    setShowResult(false);
  }

  return (
    <>
      {!showResult ? <PersonalityTestForm loading={loading} onFinish={handleFinish}/>
        : <PersonalityTestReport bigFiveList={bigFiveList} onAddPerson={handleAddPerson}/>}
    </>
  );
}
