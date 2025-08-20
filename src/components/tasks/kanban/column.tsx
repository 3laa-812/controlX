import { Text } from "@/components/Text";
import { PlusOutlined } from "@ant-design/icons";
import {
  useDroppable,
  UseDroppableArguments,
  useDndContext,
} from "@dnd-kit/core";
import { Badge, Button, Space } from "antd";
import { ReactNode } from "react";

type Props = {
  id: string;
  title: string;
  description?: ReactNode;
  count: number;
  data?: UseDroppableArguments["data"];
  onAddClick?(args: { id: string }): void;
};

const KanbanColumn = ({
  children,
  id,
  title,
  description,
  count,
  data,
  onAddClick,
}: React.PropsWithChildren<Props>) => {
  const { isOver, setNodeRef } = useDroppable({ id, data });
  const { active } = useDndContext();

  const onAddClickHandler = () => {
    onAddClick?.({ id });
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "0 16px",
      }}
    >
      <div style={{ padding: "12px" }}>
        <Space
          style={{
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Space>
            <Text
              ellipsis={{ tooltip: title }}
              size="xs"
              strong
              style={{
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              {title}
            </Text>
            {!!count && <Badge count={count} color="cyan" />}
          </Space>
          <Button
            shape="circle"
            icon={<PlusOutlined />}
            onClick={onAddClickHandler}
          />
        </Space>
        {description}
      </div>
      <div
        style={{
          flex: 1,
          overflowY: active ? "unset" : "auto",
          padding: "16px",
          border: "2px dashed transparent",
          borderColor: isOver ? "#333333" : "transparent",
          borderRadius: "4px",
        }}
      >
        <div
          style={{
            marginTop: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default KanbanColumn;
