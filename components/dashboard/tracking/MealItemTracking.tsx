import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {LoginResponse} from "../../../types/Auth";
import {GoBackButton} from "../../generic/Buttons";
import {useState, useEffect} from "react";
import {
    CreateMealItem, DeleteMealItem, GetMealItems,
} from '../../../clients/TrackingClient';
import {MealItemDTO, MealResponse} from "../../../types/Tracking";
import Loading from "../../generic/Loading";
import TextEntry, {ManualMealEntry} from "../../generic/TextEntry";
import {GetTextNutritionData, GetImageNutritionData} from "../../../clients/AIClient";
import RecentsMealEntry from "./RecentsMealEntry";
import * as ImagePicker from 'expo-image-picker';

function MealItemTracking({mealResponse, loginResponse, setScreen}: {
    mealResponse: MealResponse,
    loginResponse: () => LoginResponse | null,
    setScreen: ({newScreen, newDate, mealResponse}: {newScreen: string, newDate?: string, mealResponse?: MealResponse}) => void }){

    const [loading, setLoading] = useState(true);
    const [entryLoading, setEntryLoading] = useState(false);
    const [error, setError] = useState('');
    const [mealItems, setMealItems] = useState<MealItemDTO[]>([]);
    const jwt = loginResponse()?.jwt || '';
    const [addingWithAI, setAddingWithAI] = useState(false);
    const [addingManually, setAddingManually] = useState(false);
    const [addingRecents, setAddingRecents] = useState(false);
    const [addingWithImage, setAddingWithImage] = useState(false);

    useEffect(() => {
        if (addingWithImage) {
            handlePickImage();
        }
        const fetchData = async () => {
            setLoading(true);
            try {
                const mealsResponse = await GetMealItems({
                    mealID: mealResponse.mealID,
                    userID: loginResponse()?.user.userID || ''
                }, jwt);

                setMealItems(mealsResponse);
            } catch (e) {
                if (e instanceof Error) {
                    setError(e.message);
                } else {
                    setError('An unexpected error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [mealResponse, jwt, addingWithImage]);

    const handleGoBack = () => {
        setScreen({newScreen: 'meal'});
    }

    const getTotalCalories = ({mealItemList} : {mealItemList: MealItemDTO[]}) => {
        return parseFloat(mealItemList.reduce((total, meal) => total + meal.itemCalories, 0).toFixed(0));
    }

    const getTotalProtein = ({mealItemList} : {mealItemList: MealItemDTO[]}) => {
        return parseFloat(mealItemList.reduce((total, meal) => total + meal.itemProtein, 0).toFixed(1));
    }

    const createManualMealItem = (name: string, calories: string, protein: string, aiGenerated: boolean) => {
        setEntryLoading(true);
        createMealItem({
            itemName: name,
            itemCalories: parseInt(calories, 10),
            itemProtein: parseInt(protein, 10),
            mealID: mealResponse.mealID,
            dateID: mealResponse.dateID,
            userID: loginResponse()?.user.userID || '',
            aiGenerated: aiGenerated
        }).then(() => {
            setAddingManually(false);
            setAddingRecents(false);
        }).finally(() => {
            setEntryLoading(false);
        });
    }

    const createMealItemWithAI = async (mealName: string) => {
        setEntryLoading(true);
        await GetTextNutritionData(mealName, jwt)
            .then((response) => {
                if (response.isValidEntry) {
                    const mealItem: MealItemDTO = {
                        itemName: mealName,
                        itemCalories: response.calories,
                        itemProtein: response.protein,
                        mealID: mealResponse.mealID,
                        dateID: mealResponse.dateID,
                        userID: loginResponse()?.user.userID || '',
                        aiGenerated: true
                    };
                    createMealItem(mealItem);
                    setError('');
                } else {
                    setError('AI could not generate a valid meal item. Please try again with a different description.');
                    setAddingWithAI(false);
                }
            })
            .finally(() => {
               setEntryLoading(false);
            });
    }

    const createMealItem = async (mealItem: MealItemDTO) => {
        if (mealItems.length >= 8) {
            setError('You can only add up to 8 meal items per meal. ');
            setAddingWithAI(false);
            return;
        }
        setError('');
        setLoading(true);
        CreateMealItem(mealItem, jwt).then(response => {
            mealItem.itemID = response.itemID;
            mealItem.createdTS = response.createdTS;
        }).catch(e => {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError('An unexpected error occurred while creating the meal item.');
            }
            setLoading(false);
            return;
        }).finally(() => {
            const newMealItems = [...mealItems, mealItem];
            setMealItems(newMealItems);
            setAddingWithAI(false);
            setLoading(false);
        })
    }
    const deleteMealItem = async (mealItemID: string) => {
        try {
            await DeleteMealItem({
                userID: loginResponse()?.user.userID || '',
                mealItemID: mealItemID
            }, jwt);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError('An unexpected error occurred while deleting the meal.');
            }
        } finally {
            const mealItemList = mealItems.filter(meal => meal.itemID !== mealItemID);
            setMealItems(mealItemList);
        }
    }

    const handlePickImage = async () => {
        if (mealItems.length >= 8) {
            setError('You can only add up to 8 meal items per meal. ');
            setAddingWithImage(false);
            return;
        }
        setLoading(true);
        setError('');
        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                base64: true,
                quality: 1,
                cameraType: ImagePicker.CameraType.back,
            });
            if (!result.canceled && result.assets && result.assets.length > 0 && result.assets[0].base64) {
                const response = await GetImageNutritionData(result.assets[0].base64, jwt);
                if (response.isValidEntry) {
                    const mealItem: MealItemDTO = {
                        itemName: response.foodEntry || 'Image Meal',
                        itemCalories: response.calories,
                        itemProtein: response.protein,
                        mealID: mealResponse.mealID,
                        dateID: mealResponse.dateID,
                        userID: loginResponse()?.user.userID || '',
                        aiGenerated: true
                    };
                    await createMealItem(mealItem);
                } else {
                    setError('AI could not generate a valid meal item from the image. Please try again with a different image.');
                }
            }
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError('An unexpected error occurred while processing the image.');
            }
        } finally {
            setLoading(false);
            setAddingWithImage(false);
        }
    };

    if (loading) {
        return <Loading/>;
    }

    if (addingWithAI) {
        if (mealItems.length >= 8) {
            setError('You can only add up to 8 meal items per meal. ');
            setAddingWithAI(false);
            return null;
        }
        return (
            <TextEntry
                properties={{
                    header: `AI Entry Mode`,
                    placeholder: `Describe what you ate here...`,
                    onSubmit: createMealItemWithAI,
                    onCancel: () => {
                        setAddingWithAI(false);
                    },
                    buttonText: ' Add Meal Item ',
                    loading: entryLoading
                }}
            />
        );
    }
    if (addingManually) {
        if (mealItems.length >= 8) {
            setError("You can only add up to 8 meal items per meal. ");
            setAddingManually(false);
            return null;
        }
        return (
            <ManualMealEntry properties={{
                onSubmit: createManualMealItem,
                onCancel: () => {
                    setAddingManually(false);
                },
                loading: entryLoading
                }
            }/>
        );
    }
    if (addingRecents) {
        if (mealItems.length >= 8) {
            setError("You can only add up to 8 meal items per meal. ");
            setAddingRecents(false);
            return null;
        }
        return (
            <RecentsMealEntry properties={{
                onSubmit: createManualMealItem,
                onCancel: () => {
                    setAddingRecents(false);
                },
                userID: loginResponse()?.user.userID || '',
                jwt: jwt
            }
            }/>
        );
    }
    if (addingWithImage) {
        if (mealItems.length >= 8) {
            setError('You can only add up to 8 meal items per meal. ');
            setAddingWithImage(false);
            return null;
        }
        return (
            <Loading/>
        );
    }

    return (
        <View className={"w-full h-full flex flex-col items-center justify-between"}>
            <View className={"w-full flex flex-row justify-between items-center pl-4 pr-2"}>
                <Text className={"font-jomhuria text-4xl text-white"}>{mealResponse.mealName} </Text>
                <Text className={"font-jomhuria text-4xl text-white"}>Add Meal Items </Text>
            </View>
            <View className={"px-4 w-full flex flex-row justify-between items-center"}>
                <Text className={"text-white font-jomhuria text-4xl"}>Item Name</Text>
                <View className={"flex flex-row"}>
                    <Text className={"text-white font-jomhuria text-4xl mr-6"}>CALS</Text>
                    <Text className={"text-white font-jomhuria text-4xl mr-6"}>PROTEIN</Text>
                </View>
            </View>
            <ScrollView className={"flex-1 w-full"}>
                {mealItems.map((mealItemDTO, idx) => {
                    return (
                        <View key={idx} className="background-light-gray mb-0.5 w-full flex flex-row items-center justify-between px-2 pl-4 pb-1 pt-2 background-gray">
                            <View className={"flex w-full flex-row justify-between px-0.5"}>
                                <View className={"flex flex-row gap-1 w-1/2"}>
                                    <Text
                                      className={"text-red font-jomhuria text-3xl w-full"}
                                      numberOfLines={1}
                                      ellipsizeMode="tail"
                                    >
                                      {mealItemDTO.itemName}
                                    </Text>
                                </View>
                                <View className={"flex flex-row"}>
                                    <Text className="text-white font-jomhuria text-3xl mr-9">{mealItemDTO.itemCalories}</Text>
                                    <Text className="text-white font-jomhuria text-3xl mr-4 w-16 text-right">{mealItemDTO.itemProtein}g</Text>
                                    <TouchableOpacity className={"mr-1"} onPress={() => deleteMealItem(mealItemDTO.itemID || '')}>
                                        <Text className={"font-jomhuria text-red text-4xl"}>
                                            X
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    );
                })}
                <View className={"flex flex-row w-full background-light-gray justify-between items-center px-4 pt-1 background-gray"}>
                    <TouchableOpacity className={"pb-1"} onPress={() => setAddingWithImage(true)}>
                        <Image
                            className={"pb-1"}
                            source={require('../../../assets/camera.png')}
                            style={{ width: 35, height: 35 }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setAddingWithAI(true)}>
                        <Text className={"text-white font-jomhuria text-5xl"}>AI</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className={"pb-1"} onPress={() => setAddingManually(true)}>
                        <Image
                            className={"pb-1"}
                            source={require('../../../assets/plus.png')}
                            style={{ width: 35, height: 35 }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity className={"pb-1"} onPress={() => setAddingRecents(true)}>
                        <Image
                            className={"pb-1"}
                            source={require('../../../assets/recents.png')}
                            style={{ width: 40, height: 40 }}
                        />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {error && <Text className={"text-red text-3xl font-jomhuria text-center px-2 my-1"}>{error}</Text>}
            <View className={"flex flex-row justify-between w-full px-4 mb-3 mt-2 border-bottom-light-gray"}>
                <Text className={"font-jomhuria text-white text-4xl"}>Meal Totals </Text>
                <View className={"flex flex-row"}>
                    <Text className={"mr-2 font-jomhuria text-white text-4xl text-right"}>
                        {getTotalCalories({mealItemList: mealItems})} kcal </Text>
                    <Text className={"w-40 font-jomhuria text-white text-4xl text-right"}>
                        {getTotalProtein({mealItemList: mealItems})}g Protein
                    </Text>
                </View>
            </View>
            <View className={"flex flex-row justify-end items-center w-full px-4 align-bottom mb-4"}>
                <GoBackButton title={"Go Back"} onPress={handleGoBack} />
            </View>
        </View>
    );
}

export default MealItemTracking;
