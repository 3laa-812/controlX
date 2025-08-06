import { totalCountVariants } from "@/constants";
import { Card, Skeleton } from "antd";
import { Text } from "../Text";
import { Area, AreaConfig } from "@ant-design/plots";
import { useContext } from "react";
import { ColorModeContext } from "@/contexts/color-mode";
import { getChartColors } from "@/utilities/helpers";

type Props = {
  resource: "companies" | "contacts" | "deals";
  isLoading: boolean;
  totalCount: number;
};

const DashboardTotalCountCard = ({
  resource,
  isLoading,
  totalCount,
}: Props) => {
  const { mode } = useContext(ColorModeContext);
  const isDark = mode === "dark";
  const colors = getChartColors(isDark);

  const { primaryColor, secondaryColor, icon, title } =
    totalCountVariants[resource];
  const config: AreaConfig = {
    data: totalCountVariants[resource].data,
    xField: "index",
    yField: "value",
    padding: 0,
    shapeField: "smooth",
    autoFit: true,
    area: {
      style: {
        fill: isDark
          ? `l(270) 0:${colors.tooltipBg} 0.2${secondaryColor} 1:${primaryColor}`
          : `l(270) 0:#fff 0.2${secondaryColor} 1:${primaryColor}`,
      },
    },
    line: {
      color: primaryColor,
    },
    axis: {
      x: {
        visible: false,
      },
      y: {
        tickCount: 12,
        label: {
          style: {
            stroke: "transparent",
          },
        },
        grid: {
          line: {
            style: {
              stroke: "transparent",
            },
          },
        },
      },
    },
  };

  return (
    <Card
      style={{ height: "96px", padding: 0 }}
      styles={{ body: { padding: "10px 8px 8px 14px" } }}
      size="small"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          whiteSpace: "nowrap",
        }}
      >
        {icon}
        <Text
          size="md"
          className="secondary"
          style={{
            marginLeft: "8px",
          }}
        >
          {title}
        </Text>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Text
          size="xxxl"
          strong
          style={{
            flex: 1,
            whiteSpace: "nowrap",
            flexShrink: 0,
            textAlign: "start",
            marginLeft: "48px",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {isLoading ? (
            <Skeleton.Button style={{ marginTop: "8px", width: "74px" }} />
          ) : (
            totalCount
          )}
        </Text>
        <Area {...config} style={{ width: "50%" }} />
      </div>
    </Card>
  );
};

export default DashboardTotalCountCard;
