import { CalendarOutlined } from "@ant-design/icons";
import { Badge, Card, List } from "antd";
import { Text } from "../Text";
import UpcomingEventsSkeleton from "../skeleton/upcoming-events";
import { getDate } from "@/utilities/helpers";
import { useList } from "@refinedev/core";
import { DASHBOARD_CALENDAR_UPCOMING_EVENTS_QUERY } from "@/graphql/queries";
import { useContext } from "react";
import { ColorModeContext } from "@/contexts/color-mode";

const UpcomingEvents = () => {
  const { mode } = useContext(ColorModeContext);
  const isDark = mode === "dark";

  const { data, isLoading } = useList({
    resource: "events",
    pagination: { pageSize: 5 },
    sorters: [
      {
        field: "startDate",
        order: "asc",
      },
    ],
    // filters: [
    //   {
    //     field: "startDate",
    //     operator: "gte",
    //     value: dayjs().format("YYYY-MM-DD"),
    //   },
    // ],
    meta: {
      gqlQuery: DASHBOARD_CALENDAR_UPCOMING_EVENTS_QUERY,
    },
  });

  return (
    <Card
      style={{ height: "100%" }}
      styles={{ header: { padding: "8px 16px" }, body: { padding: "0 1rem" } }}
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <CalendarOutlined />
          <Text size="sm" style={{ marginLeft: "0.7rem" }}>
            Upcoming Events
          </Text>
        </div>
      }
    >
      {isLoading ? (
        <List
          itemLayout="horizontal"
          dataSource={Array.from({ length: 5 }).map((_, index) => ({
            id: index,
          }))}
          renderItem={() => <UpcomingEventsSkeleton />}
        />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={data?.data || []}
          renderItem={(item) => {
            const renderDate = getDate(item.startDate, item.endDate);
            return (
              <List.Item>
                <List.Item.Meta
                  avatar={<Badge color={item.color} />}
                  title={
                    <Text
                      size="xs"
                      style={{ color: isDark ? "#d9d9d9" : "#666" }}
                    >
                      {renderDate}
                    </Text>
                  }
                  description={
                    <Text
                      ellipsis={{ tooltip: true }}
                      strong
                      style={{ color: isDark ? "#fff" : "#000" }}
                    >
                      {item.title}
                    </Text>
                  }
                />
              </List.Item>
            );
          }}
        />
      )}
      {!isLoading && data?.data.length === 0 && (
        <span
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "220px",
            color: isDark ? "#8c8c8c" : "#666",
          }}
        >
          No Upcoming Events
        </span>
      )}
    </Card>
  );
};

export default UpcomingEvents;
