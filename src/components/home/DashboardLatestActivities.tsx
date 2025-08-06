import { UnorderedListOutlined } from "@ant-design/icons";
import { Card, List, Space } from "antd";
import { Text } from "../Text";
import LatestActivitiesSkeleton from "../skeleton/latest-activities";
import { useList } from "@refinedev/core";
import {
  DASHBOARD_LATEST_ACTIVITIES_AUDITS_QUERY,
  DASHBOARD_LATEST_ACTIVITIES_DEALS_QUERY,
} from "@/graphql/queries";
import dayjs from "dayjs";
import CustomAvatar from "../CustomAvatar";
import { useContext } from "react";
import { ColorModeContext } from "@/contexts/color-mode";

const DashboardLatestActivities = () => {
  const { mode } = useContext(ColorModeContext);
  const isDark = mode === "dark";

  const {
    data: audit,
    isLoading: isLoadingAudit,
    isError,
    error,
  } = useList({
    resource: "audits",
    meta: {
      gqlQuery: DASHBOARD_LATEST_ACTIVITIES_AUDITS_QUERY,
    },
  });

  const dealIds = audit?.data?.map((audit) => audit?.targetId);

  const { data: deals, isLoading: isLoadingDeals } = useList({
    resource: "deals",
    queryOptions: {
      enabled: !!dealIds?.length,
    },
    pagination: {
      mode: "off",
    },
    filters: [
      {
        field: "id",
        operator: "in",
        value: dealIds,
      },
    ],
    meta: {
      gqlQuery: DASHBOARD_LATEST_ACTIVITIES_DEALS_QUERY,
    },
  });

  if (isError) {
    console.log(error);
    return null;
  }

  const isLoading = isLoadingAudit || isLoadingDeals; // Replace with actual loading state
  return (
    <Card
      styles={{ body: { padding: "0 1rem" }, header: { padding: "16px" } }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <UnorderedListOutlined />
          <Text size="md" style={{ marginLeft: "0.5rem" }}>
            Latest Activities
          </Text>
        </div>
      }
    >
      {isLoading ? (
        <List
          itemLayout="horizontal"
          dataSource={Array.from({ length: 5 }).map((_, i) => ({ id: i }))}
          renderItem={(_, index) => <LatestActivitiesSkeleton key={index} />}
        />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={audit?.data}
          renderItem={(item) => {
            const deal =
              deals?.data?.find((deal) => deal.id == item.targetId) ||
              undefined;
            return (
              <List.Item>
                <List.Item.Meta
                  title={
                    <Text style={{ color: isDark ? "#fff" : "#000" }}>
                      {dayjs(deal?.createdAt).format("MMM DD, YYYY - HH:mm")}
                    </Text>
                  }
                  avatar={
                    <CustomAvatar
                      shape="square"
                      size={46}
                      src={deal?.company.avatarUrl}
                      name={deal?.company.name}
                    />
                  }
                  description={
                    <Space size={4}>
                      <Text style={{ color: isDark ? "#d9d9d9" : "#666" }}>
                        {item.action === "CREATE" ? "created" : "moved"}
                      </Text>
                      <Text strong style={{ color: isDark ? "#fff" : "#000" }}>
                        {deal?.title}
                      </Text>
                      <Text style={{ color: isDark ? "#d9d9d9" : "#666" }}>
                        deal
                      </Text>
                      <Text style={{ color: isDark ? "#d9d9d9" : "#666" }}>
                        {item.action === "CREATE" ? "In" : "to"}
                      </Text>
                      <Text strong style={{ color: isDark ? "#fff" : "#000" }}>
                        {deal?.stage.title}
                      </Text>
                    </Space>
                  }
                />
              </List.Item>
            );
          }}
        />
      )}
    </Card>
  );
};

export default DashboardLatestActivities;
