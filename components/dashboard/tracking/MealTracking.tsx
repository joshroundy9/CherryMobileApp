import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {LoginResponse} from "../../../types/Auth";
import RedButton, {GoBackButton} from "../../generic/Buttons";
import {useState, useEffect} from "react";
import {
    CreateMeal,
    DeleteMeal,
    GetMeals,
    GetOrCreateDate, UpdateDateNutrition,
    UpdateDateWeight,
    UpdateUserWeight
} from '../../../clients/TrackingClient';
import {DateResponse, MealResponse} from "../../../types/Tracking";
import Loading from "../../generic/Loading";
import TextEntry from "../../generic/TextEntry";

function MealTracking({date, loginResponse, setLoginResponse, setScreen}: {
    date: string,
    loginResponse: () => LoginResponse | null,
    setLoginResponse: (loginResponse: LoginResponse | null) => void,
    setScreen: ({newScreen, newDate, mealResponse}: {newScreen: string, newDate?: string, mealResponse?: MealResponse}) => void }){

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [meals, setMeals] = useState<MealResponse[]>([]);
    const [dateResponse, setDateResponse] = useState<DateResponse | null>(null);
    const jwt = loginResponse()?.jwt || '';
    const [addingMeal, setAddingMeal] = useState(false);
    const [addMealTime, setAddMealTime] = useState('');
    const [updatingWeight, setUpdatingWeight] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const dateResponse = await GetOrCreateDate({
                    date: date,
                    userID: loginResponse()?.user.userID || ''
                }, jwt);

                setDateResponse(dateResponse);

                if (Number(dateResponse.dailyWeight) === 0) {
                    await updateWeight(loginResponse()?.user.weight || '0', dateResponse);
                }

                const mealsResponse = await GetMeals({
                    dateID: dateResponse.dateID,
                    userID: loginResponse()?.user.userID || ''
                }, jwt);

                setMeals(mealsResponse);
                const newCalories = getTotalCalories({mealList: mealsResponse});
                const newProtein = getTotalProtein({mealList: mealsResponse});
                if (newCalories != Number(dateResponse.dailyCalories) || newProtein != Number(dateResponse.dailyProtein)) {
                    await updateDateNutrition(getTotalCalories({mealList: mealsResponse}), getTotalProtein({mealList: mealsResponse}), dateResponse);
                }
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
    }, [date, jwt]);

    const handleUpdateWeight = () => {
        setUpdatingWeight(true);
    };

    const handleGoBack = () => {
        updateDateNutrition(getTotalCalories({mealList: meals}), getTotalProtein({mealList: meals}), dateResponse).then(() => {
            setScreen({newScreen: 'calendar'});
            }
        );

    }

    const getTotalCalories = ({mealList} : {mealList: MealResponse[]}) => {
        return mealList.reduce((total, meal) => total + meal.mealCalories, 0);
    }

    const getTotalProtein = ({mealList} : {mealList: MealResponse[]}) => {
        return mealList.reduce((total, meal) => total + meal.mealProtein, 0);
    }

    const createMeal = async (mealName: string) => {
        await updateDateNutrition(getTotalCalories({mealList: meals}), getTotalProtein({mealList: meals}), dateResponse);
        CreateMeal({
            mealName: mealName,
            userID: `${loginResponse()?.user.userID}`,
            dateID: `${dateResponse?.dateID}`,
            time: addMealTime + ':00'
        }, jwt).then(response => {
            newMeal.mealID = response.mealID;
        }).catch(e => {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError('An unexpected error occurred while creating the meal.');
            }
            return;
        })
        const newMeal: MealResponse = {
            mealName: mealName,
            time: addMealTime,
            mealID: '',
            userID: loginResponse()?.user.userID || '',
            dateID: dateResponse?.dateID || '',
            mealCalories: 0,
            mealProtein: 0
        };
        setMeals([...meals, newMeal]);
        setAddingMeal(false);
        setAddMealTime("");
    }
    const deleteMeal = async (mealID: string) => {
        try {
            await updateDateNutrition(getTotalCalories({mealList: meals}), getTotalProtein({mealList: meals}), dateResponse);
            await DeleteMeal({
                userID: loginResponse()?.user.userID || '',
                mealID: mealID
            }, jwt);
            setMeals(meals.filter(meal => meal.mealID !== mealID));
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError('An unexpected error occurred while deleting the meal.');
            }
        }
    }

    const updateDateNutrition = async (totalCalories: number, totalProtein: number, dateResponse: DateResponse | null) => {
        if (!dateResponse) {
            setError('Date response is not available');
            return;
        }
        try {
            await UpdateDateNutrition({
                dateID: dateResponse.dateID,
                userID: loginResponse()?.user.userID || '',
                dailyCalories: totalCalories.toString(),
                dailyProtein: totalProtein.toString()
            }, jwt);
            setDateResponse({
                ...dateResponse,
                dailyCalories: totalCalories.toString(),
                dailyProtein: totalProtein.toString()
            });
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError('An unexpected error occurred while updating the date nutrition.');
            }
        }
    }

    const updateWeight = async (weight: string, dateResponse: DateResponse | null) => {
        if (!dateResponse) {
            setError('Date response is not available');
            return;
        }
        if (!weight || isNaN(Number(weight))) {
            setError('Please enter a valid weight.');
            setUpdatingWeight(false);
            return;
        }
        try {
            await UpdateDateWeight({
                dateID: dateResponse.dateID,
                userID: loginResponse()?.user.userID || '',
                dailyWeight: weight,
            }, jwt);
            if (date === new Date().toLocaleDateString('en-CA')) {
                console.log('Updating user weight in login response');
                const updatedUser = await UpdateUserWeight({
                    userID: loginResponse()?.user.userID || '',
                    weight: weight
                }, jwt);
                const prev = loginResponse();
                if (prev) {
                    setLoginResponse({
                        ...prev,
                        user: {
                            ...prev.user,
                            weight: updatedUser.weight
                        }
                    });
                }
            }
            setDateResponse({
                ...dateResponse,
                dailyWeight: weight
            });
            setUpdatingWeight(false);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError('An unexpected error occurred while updating the weight.');
            }
        }
    }
    const handleUpdateWeightTextEntry = (text: string) => {
        updateWeight(text, dateResponse);
    }

    if (loading) {
        return <Loading/>;
    }

    if (updatingWeight) {
        return (
            <TextEntry
                properties={{
                    header: `Update Weight: ${Number(dateResponse?.dailyWeight) === 0 ? loginResponse()?.user.weight : dateResponse?.dailyWeight} lbs`,
                    placeholder: `Weight (LBS)`,
                    onSubmit: handleUpdateWeightTextEntry,
                    onCancel: () => {
                        setUpdatingWeight(false);
                    },
                    buttonText: 'Update Weight',
                    maxLength: 4
                }}
            />
        );
    }

    if (addingMeal) {
        return (
            <TextEntry
                properties={{
                    header: `Create Meal: ${addMealTime}`,
                    placeholder: `Enter meal name`,
                    onSubmit: createMeal,
                    onCancel: () => {
                        setAddingMeal(false);
                        setAddMealTime("");
                    },
                    buttonText: 'Create Meal',
                    maxLength: 30
                }}
            />
        );
    }

    const intervals = Array.from({length: 12}, (_, i) => {
        const startHour = i * 2;
        const endHour = startHour + 2;
        return {
            label: `${((startHour % 12) || 12)}${startHour < 12 ? 'am' : 'pm'} - ${((endHour % 12) || 12)}${endHour < 12 ? 'am' : 'pm'}`,
            start: startHour,
            end: endHour
        };
    });

    const getMealForInterval = (start: number, end: number) => {
        return meals.find(meal => {
            // Assume meal.time is a string like 'HH:mm' or Date
            if (!meal.time || typeof meal.time !== 'string') return false;
            let mealHour = parseInt(meal.time.split(':')[0], 10);
            return mealHour >= start && mealHour < end;
        });
    };

    // Defensive: Ensure date is a valid string before splitting
    const [year, month, day] = (typeof date === 'string' && date.includes('-'))
        ? date.split('-').map(Number)
        : [NaN, NaN, NaN];

    return (
        <View className={"w-full h-full flex flex-col items-center justify-between"}>
            <View className={"w-full flex flex-row justify-between items-center px-4"}>
                <Text className={"font-jomhuria text-4xl text-white"}>
                    {(() => {
                        if (isNaN(year) || isNaN(month) || isNaN(day)) return "Invalid date";
                        const dateObj = new Date(year, month - 1, day); // month - 1 because Date months are 0-indexed
                        const dayNum = dateObj.getDate();
                        const monthName = dateObj.toLocaleDateString('en-CA', { month: 'long' });
                        const yearNum = dateObj.getFullYear();
                        const suffix = dayNum > 3 && dayNum < 21 ? 'th' : ['th', 'st', 'nd', 'rd'][dayNum % 10] || 'th';
                        return `${monthName} ${dayNum}${suffix}, ${yearNum}`;
                    })()}
                </Text>
                <Text className={"font-jomhuria text-4xl text-white"}>Create Meals </Text>
            </View>
            <View className={"px-4 w-full flex flex-row justify-between items-center"}>
                <Text className={"text-white font-jomhuria text-4xl ml-7"}>Meal Name</Text>
                <View className={"flex flex-row"}>
                    <Text className={"text-white font-jomhuria text-4xl mr-6"}>CALS</Text>
                    <Text className={"text-white font-jomhuria text-4xl mr-6"}>PROTEIN</Text>
                </View>
            </View>
            <View className={"flex-1 w-full"}>
                {intervals.map((interval, idx) => {
                    const meal = getMealForInterval(interval.start, interval.end);
                    return (
                        <View key={idx} className="border-b border-b-gray-700 w-full flex flex-row items-center justify-between px-2 pb-1 pt-2 background-gray">
                            {meal ? (
                                <View className={"flex w-full flex-row justify-between px-0.5"}>
                                    <TouchableOpacity className={"flex flex-row gap-1 w-1/2"} onPress={() => setScreen({newScreen: 'mealitem', newDate: date, mealResponse: meal})}>
                                        <Image
                                            source={require('../../../assets/edit.png')}
                                            style={{ width: 25, height: 25 }}
                                        />
                                        <Text className="text-red font-jomhuria text-3xl w-full"
                                              numberOfLines={1}
                                              ellipsizeMode="tail">{meal.mealName}
                                        </Text>
                                    </TouchableOpacity>
                                    <View className={"flex flex-row"}>
                                        <Text className="text-white font-jomhuria text-3xl mr-9">{meal.mealCalories}</Text>
                                        <Text className="text-white font-jomhuria text-3xl mr-4 w-16 text-right">{meal.mealProtein}g</Text>
                                        <TouchableOpacity className={"mr-1"} onPress={() => deleteMeal(meal.mealID)}>
                                            <Text className={"font-jomhuria text-red text-4xl"}>
                                                X
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    className="w-full flex flex-row"
                                    onPress={() => {
                                        setAddingMeal(true);
                                        setAddMealTime(`${interval.start.toString().padStart(2, '0')}:00`);
                                    }}
                                >
                                    <Image className={"mr-1.5"}
                                        source={require('../../../assets/add.png')}
                                        style={{ width: 25, height: 25 }}
                                    />
                                    <Text className="text-3xl text-white font-jomhuria">({interval.label})</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    );
                })}
                <View className={"flex flex-row justify-between w-full px-4 mt-1"}>
                    <Text className={"font-jomhuria text-white text-4xl"}>Daily Totals</Text>
                    <View className={"flex flex-row mt-0.5"}>
                        <Text className={"mr-6 font-jomhuria text-white text-3xl text-right"}>
                            {getTotalCalories({mealList: meals})}
                        </Text>
                        <Text className={"w-20 mr-6 font-jomhuria text-white text-3xl text-right"}>
                            {getTotalProtein({mealList: meals})}g
                        </Text>
                    </View>
                </View>
            </View>

            {error && <Text className={"text-red text-3xl font-jomhuria text-center px-2"}>{error}</Text>}

            <View className={"flex flex-row justify-between items-center w-full px-4 align-bottom mb-4"}>
                <RedButton title={` Update Weight: ${Number(dateResponse?.dailyWeight) === 0 ? loginResponse()?.user.weight : dateResponse?.dailyWeight} lbs `} onPress={handleUpdateWeight} />
                <GoBackButton title={"Go Back"} onPress={handleGoBack} />
            </View>
        </View>
    );
}

export default MealTracking;

