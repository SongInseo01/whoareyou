import {Form, Radio, Space, Typography} from "antd";

const { Title } = Typography;

export function FormItem({name, label, reversePoint}: { name: string, label: string, reversePoint?: boolean }) {
  return (
    <Form.Item name={name} colon={false} labelCol={{span: 24}}
               label={<Title level={5}>{label}</Title>}
               validateStatus="error"
               rules={[{
                 required: true,
                 message: "항목을 선택해 주세요.",
               }]}
    >
      <Space>
        <span>전혀 아니다</span>
        <Radio.Group>
          {reversePoint ?
            <>
              <Radio value="5" style={{flexDirection: "column-reverse", paddingBottom: "40px",  paddingLeft: "5px"}}>1</Radio>
              <Radio value="4" style={{flexDirection: "column-reverse", paddingLeft: "5px"}}>2</Radio>
              <Radio value="3" style={{flexDirection: "column-reverse", paddingLeft: "5px"}}>3</Radio>
              <Radio value="2" style={{flexDirection: "column-reverse", paddingLeft: "5px"}}>4</Radio>
              <Radio value="1" style={{flexDirection: "column-reverse", paddingLeft: "5px"}}>5</Radio>
            </>
          : <>
              <Radio value="1" style={{flexDirection: "column-reverse", paddingBottom: "40px",  paddingLeft: "5px"}}>1</Radio>
              <Radio value="2" style={{flexDirection: "column-reverse", paddingLeft: "5px"}}>2</Radio>
              <Radio value="3" style={{flexDirection: "column-reverse", paddingLeft: "5px"}}>3</Radio>
              <Radio value="4" style={{flexDirection: "column-reverse", paddingLeft: "5px"}}>4</Radio>
              <Radio value="5" style={{flexDirection: "column-reverse", paddingLeft: "5px"}}>5</Radio>
            </>}
        </Radio.Group>
        <span>매우 그렇다</span>
      </Space>
    </Form.Item>
  );
}

export default FormItem;
