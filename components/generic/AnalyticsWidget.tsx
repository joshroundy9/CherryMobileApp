import {Text, View} from "react-native";

function AnalyticsWidget({header, text}: {header: string, text: string}) {
  return (
      <View className={"w-full h-full p-2 flex flex-col background-light-gray rounded-xl justify-between items-center"}>
          <Text className={"font-jomhuria text-2xl text-white text-center"}>{header} </Text>
          <Text className={"font-jomhuria text-white text-center"} style={{fontSize: 52}}>
              {text}
          </Text>
      </View>
  );
}
export default AnalyticsWidget;