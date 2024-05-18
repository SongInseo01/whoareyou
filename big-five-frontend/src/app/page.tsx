'use client';

import {useState} from "react";
import PersonalityTestForm from "@/components/PersonalityTestForm";
import PersonalityTestReport, {IBigFive} from "@/components/PersonailtyTestReport";

export default function PersonalityTest() {
  const [showResult, setShowResult] = useState(false);
  const [bigFiveList, setBigFiveList] = useState<IBigFive[]>([]);

  const handleFinish = async (values: any) => {
    const bigFiveResult : IBigFive = {
      extraversion: calculateExtraversion(values),
      neuroticism: calculateNeuroticism(values),
      conscientiousness: calculateConscientiousness(values),
      agreeableness: calculateAgreeableness(values),
      openness: calculateOpenness(values),
    }

    const bigFiveResult2 = {
      extraversion: "낮음",
      neuroticism: "낮음",
      conscientiousness: "높음",
      agreeableness: "낮음",
      openness: "중상",
    }

    const res = await fetch('http://localhost:8000/qa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bigFiveResult2),
    })

    const commentary = await res.json();

    bigFiveResult.commentary = commentary.desc;
    // bigFiveResult.commentary = "난는 너무나 좋은 사람이예여...";

    setBigFiveList(bigFiveList.concat([bigFiveResult]));
    setShowResult(true);
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
      {!showResult ? <PersonalityTestForm onFinish={handleFinish}/>
        : <PersonalityTestReport bigFiveList={bigFiveList} onAddPerson={handleAddPerson}/>}
    </>
  );
}
