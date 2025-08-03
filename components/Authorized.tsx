import {Button, Text, View} from "react-native";
import Logo from "./Logo";

function Authorized({ children, onLogout }: { children: React.ReactNode, onLogout: () => void }) {
  return (
      <View className={"w-3/4 flex flex-col items-center justify-center"}>
          <Logo />
          <Text className="text-white font-jomhuria text-2xl">You are authorized to view this area.</Text>
          <Button title="Log Out" onPress={onLogout} />
      </View>
  );
}
export default Authorized;