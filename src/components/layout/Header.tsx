import { Layout, Space } from "antd"
import CurrentUser from "./CurrentUser"

const Header = () => {

  const headerStyle: React.CSSProperties = {
    background: "#000000",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 24px",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  }

  return (
    <Layout.Header style={headerStyle}>
      <Space align="center" size={"middle"}>
        <CurrentUser/>
      </Space>
    </Layout.Header>
  )
}

export default Header