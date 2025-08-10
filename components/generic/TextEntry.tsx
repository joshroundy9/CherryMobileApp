import React, { useState } from 'react';
import {View, TextInput, TouchableWithoutFeedback, Keyboard, Text, TouchableOpacity} from 'react-native';
import RedButton, {GoBackButton} from "./Buttons";

interface TextEntryProps {
    onSubmit: (text: string) => void;
    onCancel: () => void;
    header: string;
    placeholder?: string;
    buttonText?: string;
    maxLength?: number;
}

interface ManualMealEntryProps {
    onSubmit: (name: string, calories: string, protein: string) => void;
    onCancel: () => void;
}

export function ManualMealEntry({ properties }: {properties: ManualMealEntryProps}) {
    const [text, setText] = useState('');
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        if(loading) return;
        setLoading(true);
        properties.onSubmit(text, calories, protein);
        setText('');
        setCalories('');
        setProtein('');
        setLoading(false);
    };

    const handleCalorieInput = (text: string) => {
        const numericText = text.replace(/[^0-9]/g, '').slice(0, 5);
        setCalories(numericText);
    };

    const handleProteinInput = (text: string) => {
        const numericText = text.replace(/[^0-9]/g, '').slice(0, 4);
        setProtein(numericText);
    };

    return (
        <View className="rounded-lg p-4 w-full">
            <Text className={"font-jomhuria text-5xl text-white text-center"}>
                Manual Entry Mode
            </Text>
            <TextInput
                value={text}
                onChangeText={setText}
                onSubmitEditing={handleSubmit}
                placeholder={"Item description..."}
                className="placeholder:text-white text-white font-jomhuria text-3xl mt-4 pt-4 mb-2 background-light-gray w-full rounded"
                autoFocus
                returnKeyType="done"
            />
            <View className={"w-full flex flex-row justify-between items-center mb-2 gap-1"}>
                <TextInput className={"placeholder:text-white text-white font-jomhuria text-3xl background-light-gray rounded pl-2 pt-4 pb-2"}
                           style={{width: '49%'}}
                           placeholder={"Calories"}
                            value={calories}
                            onChangeText={handleCalorieInput}
                            keyboardType="numeric"
                />
                <TextInput className={"placeholder:text-white text-white font-jomhuria text-3xl background-light-gray rounded pl-2 pt-4 pb-2"}
                           style={{width: '49%'}}
                           placeholder={"Protein (g)"}
                           value={protein}
                           onChangeText={handleProteinInput}
                           keyboardType="numeric"
                />
            </View>
            <View className={"flex flex-row justify-between"}>
                <TouchableOpacity className={"text-red font-jomhuria text-3xl mt-0.5"} onPress={() => setText('')}>
                    <Text className={"text-red font-jomhuria text-3xl"}>Clear</Text>
                </TouchableOpacity>
                <View className={"flex flex-row gap-2"}>
                    <RedButton title={" Add Meal Item "} onPress={handleSubmit}/>
                    <GoBackButton title={" Cancel "} onPress={properties.onCancel} />
                </View>
            </View>
        </View>
    );
}

function TextEntry({ properties }: {properties: TextEntryProps}) {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        if(loading) return;
        setLoading(true);
        properties.onSubmit(text);
        setText('');
        setLoading(false);
    };

    const handleType = (text: string) => {
        if (properties.maxLength && text.length > properties.maxLength) {
            setText(text.slice(0, properties.maxLength));
        } else {
            setText(text);
        }
    }

    return (
                    <View className="rounded-lg p-4 w-full">
                        <Text className={"font-jomhuria text-5xl text-white text-center"}>
                            {properties.header}
                        </Text>
                        <TextInput
                            value={text}
                            onChangeText={handleType}
                            onSubmitEditing={handleSubmit}
                            placeholder={properties.placeholder}
                            className="placeholder:text-white text-white font-jomhuria text-3xl mt-4 pt-4 mb-2 background-light-gray w-full rounded"
                            autoFocus
                            returnKeyType="done"
                        />
                        <View className={"flex flex-row justify-between"}>
                            <TouchableOpacity className={"text-red font-jomhuria text-3xl mt-0.5"} onPress={() => setText('')}>
                                <Text className={"text-red font-jomhuria text-3xl"}>Clear</Text>
                            </TouchableOpacity>
                            <View className={"flex flex-row gap-2"}>
                                <RedButton title={properties.buttonText || ''} onPress={handleSubmit}/>
                                <GoBackButton title={" Cancel "} onPress={properties.onCancel} />
                            </View>
                        </View>
                    </View>
    );
}

export default TextEntry;