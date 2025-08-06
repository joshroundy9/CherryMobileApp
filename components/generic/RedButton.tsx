import {TouchableOpacity, Text} from "react-native";

function RedButton({ title, onPress, disabled = false }: { title: string, onPress: () => void, disabled?: boolean }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            className={`px-4 py-1 rounded-sm text-red background-red text-black ${disabled ? 'bg-red-400' : 'background-red'}`}
        >
            <Text className={"font-jomhuria text-3xl"}>{title}</Text>
        </TouchableOpacity>
    );
}
export default RedButton;