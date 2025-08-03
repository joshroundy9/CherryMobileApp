import {Button, Text, View} from "react-native";
import "./global.css";

function Authorized({ children, onLogout }: { children: React.ReactNode, onLogout: () => void }) {
  return (
      <View className={""}>
          <Text>You are authorized to view this area.</Text>
          <Button title="Log Out" onPress={onLogout} />
      </View>
  );
}
export default Authorized;