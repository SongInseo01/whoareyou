import {useEffect, useRef, useState} from "react";
import * as echarts from "echarts";
import {Button, Divider, Space, Typography} from "antd";
import {ReloadOutlined, UserAddOutlined} from "@ant-design/icons";

const {Title} = Typography;

export interface IBigFive {
  extraversion: number;
  neuroticism: number;
  conscientiousness: number;
  agreeableness: number;
  openness: number;
}

export default function PersonalityTestReport({bigFiveList, onAddPerson}: {
  bigFiveList?: IBigFive[] | null,
  onAddPerson: () => void
}) {
  const chartRef = useRef(null);
  const [options, setOptions] = useState({
    radar: {
      indicator: [
        {name: '외향성', max: 4},
        {name: '신경성', max: 4},
        {name: '성실성', max: 4},
        {name: '친화성', max: 4},
        {name: '개방성', max: 4},
      ]
    },
    series: [
      {
        type: 'radar',
        data: []
      }
    ],
    toolbox: {
      right: "10%",
      feature: {
        saveAsImage: {
          title: "이미지로 저장하기",
          name: "Big Five personality traits"
        }
      }
    }
  });

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);
      chart.setOption(options);
    }
  }, [chartRef, options]);

  useEffect(() => {
    if (chartRef.current && bigFiveList && bigFiveList.length > 0) {
      const seriesData = bigFiveList.map((bigFive, index) => {
        return {
          value: [bigFive.extraversion, bigFive.neuroticism, bigFive.conscientiousness, bigFive.agreeableness, bigFive.openness],
          name: `${index + 1} 번째`,
        }
      });
      setOptions({
        ...options,
        legend: {
          data: seriesData.map((data, idx) => `${idx + 1} 번째`),
        },
        series: [
          {
            type: 'radar',
            //@ts-ignore
            data: seriesData
          }
        ]
      })
    }
  }, [bigFiveList]);

  return (
    <div>
      <Title level={1} className="flex flex-col items-center justify-between p-10">진단 결과</Title>
      <Divider/>
      <div className="flex flex-col items-center justify-between">
        <Space>
          <Button type="primary" icon={<ReloadOutlined/>} onClick={() => window.location.reload()}>
            처음부터 다시하기
          </Button>
          <Button icon={<UserAddOutlined/>} onClick={onAddPerson}>
            다른 사람 추가하기
          </Button>
        </Space>
        <div
          ref={chartRef}
          style={{
            marginTop: "30px",
            width: "100%",
            height: "450px",
          }}
        />
      </div>
    </div>
  )
}