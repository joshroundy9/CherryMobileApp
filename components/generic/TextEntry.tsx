import React, { useState } from 'react';
import {View, TextInput, TouchableWithoutFeedback, Keyboard, Text, TouchableOpacity} from 'react-native';
import RedButton, {GoBackButton} from "./Buttons";

interface TextEntryProps {
    onSubmit: (text: string) => void;
    onCancel: () => void;
    header: string;
    placeholder?: string;
}

function TextEntry({ properties }: {properties: TextEntryProps}) {
    const [text, setText] = useState('');

    const handleSubmit = () => {
        properties.onSubmit(text);
        setText('');
    };

    const handleType = (text: string) => {
        if (text.length > 30) {
            setText(text.slice(0, 30)); // Limit input to 100 characters
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
                            className="placeholder:text-white text-white font-jomhuria text-3xl mt-4 mb-2 background-light-gray w-full rounded"
                            autoFocus
                            returnKeyType="done"
                        />
                        <View className={"flex flex-row justify-between"}>
                            <TouchableOpacity className={"text-red font-jomhuria text-3xl mt-0.5"} onPress={() => setText('')}>
                                <Text className={"text-red font-jomhuria text-3xl"}>Clear</Text>
                            </TouchableOpacity>
                            <View className={"flex flex-row gap-2"}>
                                <RedButton title={" Add Meal "} onPress={handleSubmit}/>
                                <GoBackButton title={" Cancel "} onPress={properties.onCancel} />
                            </View>
                        </View>
                    </View>
    );
}

export default TextEntry;