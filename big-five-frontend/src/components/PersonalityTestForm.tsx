import {useForm} from "antd/lib/form/Form";
import {Button, Divider, Form, Typography} from "antd";
import FormItem from "@/components/FormItem";
import {MonitorOutlined} from "@ant-design/icons";
import React from "react";

const {Title} = Typography;

export default function PersonalityTestForm({onFinish, loading}: { onFinish: (values: any) => void, loading: boolean }) {
  const [form] = useForm();

  const handleFinish = (values: any) => {
    onFinish(values);
    form.resetFields();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-5">
      <Title level={1}>성격 진단표</Title>
      <Divider/>
      <Form form={form} scrollToFirstError={true} className="text-center" onFinish={handleFinish}>
        <FormItem name="linePoint1" label="1. 모르는 사람에게 먼저 말은 건다"/>
        <FormItem name="linePoint2" label="2. 다른 사람이 편안하고 행복한지 확인한다"/>
        <FormItem name="linePoint3" label="3. 그림, 글, 음악을 창작한다"/>
        <FormItem name="linePoint4" label="4. 모든 일을 사전에 준비한다"/>
        <FormItem name="linePoint5" label="5. 울적하거나 우울함을 느낀다"/>
        <FormItem name="linePoint6" label="6. 회식, 파티, 사교모임을 계획한다"/>
        <FormItem name="linePoint7" label="7. 사람들을 모욕한다" reversePoint={true}/>
        <FormItem name="linePoint8" label="8. 철학적이거나 영적인 문제들을 생각한다"/>
        <FormItem name="linePoint9" label="9. 일이나 물건을 정리하지 않고 어지럽게 그냥 둔다" reversePoint={true}/>
        <FormItem name="linePoint10" label="10. 스트레스나 걱정을 느낀다"/>
        <FormItem name="linePoint11" label="11. 어려운 단어를 사용한다"/>
        <FormItem name="linePoint12" label="12. 타인의 감정에 공감한다"/>
        <div className="text-center">
          <Button type="primary" htmlType="submit" icon={<MonitorOutlined/>} loading={loading}>
            제출
          </Button>
        </div>
      </Form>
    </main>
  );
}