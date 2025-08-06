import { DollarOutlined } from "@ant-design/icons";
import { Card } from "antd";
import { Text } from "../Text";
import { Area, AreaConfig } from "@ant-design/plots";
import { useList } from "@refinedev/core";
import { DASHBOARD_DEALS_CHART_QUERY } from "@/graphql/queries";
import { useMemo, useContext } from "react";
import { mapDealsData, getDealsChartColors } from "@/utilities/helpers";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { DashboardDealsChartQuery } from "@/graphql/types";
import { ColorModeContext } from "@/contexts/color-mode";

const DealsChart = () => {
  const { mode } = useContext(ColorModeContext);
  const isDark = mode === "dark";
  const colors = getDealsChartColors(isDark);

  const { data } = useList<GetFieldsFromList<DashboardDealsChartQuery>>({
    resource: "dealStages",
    filters: [{ field: "title", operator: "in", value: ["WON", "LOST"] }],
    meta: {
      gqlQuery: DASHBOARD_DEALS_CHART_QUERY,
    },
  });

  const dealData = useMemo(() => {
    return mapDealsData(data?.data);
  }, [data?.data]);

  const config: AreaConfig = {
    data: dealData,
    xField: "timeText",
    yField: "value",
    seriesField: "state",
    height: 400,
    autoFit: true,
    shapeField: "smooth",
    colorField: "state",
    legend: {
      offsetY: -6,
      itemName: {
        style: {
          fill: colors.text,
        },
      },
    },
    axis: {
      x: {
        label: {
          style: {
            fill: colors.text,
          },
        },
        line: {
          style: {
            stroke: colors.axisLine,
          },
        },
        grid: {
          line: {
            style: {
              stroke: colors.gridLine,
            },
          },
        },
      },
      y: {
        tickCount: 5,
        label: {
          style: {
            fill: colors.text,
          },
          formatter: (v: number) => {
            return `${Number(v) / 1000}k`;
          },
        },
        line: {
          style: {
            stroke: colors.axisLine,
          },
        },
        grid: {
          line: {
            style: {
              stroke: colors.gridLine,
            },
          },
        },
      },
    },
    tooltip: {
      fields: ["state", "value"],
      formatter: (datum: { state: string; value: number }) => ({
        name: datum.state,
        value: `${Number(datum.value) / 1000}k`,
      }),
      domStyles: {
        "g2-tooltip": {
          backgroundColor: colors.tooltipBg,
          color: colors.text,
          border: `1px solid ${colors.tooltipBorder}`,
        },
      },
    },
  };

  return (
    <Card
      style={{ height: "100%" }}
      styles={{
        body: { padding: "8px 16px" },
        header: { padding: "0 1rem" },
      }}
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <DollarOutlined />
          <Text size="sm" style={{ marginLeft: "0.5rem" }}>
            Deals
          </Text>
        </div>
      }
    >
      {dealData.length > 0 ? (
        <Area {...config} />
      ) : (
        <div
          style={{
            height: "300px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: colors.noDataText,
          }}
        >
          No data available
        </div>
      )}
    </Card>
  );
};

export default DealsChart;
