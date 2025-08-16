import {View, Text, TouchableOpacity, ScrollView} from "react-native";
import {useState} from "react";
import {LoginResponse} from "../../../types/Auth";
import RedButton from "../../generic/Buttons";

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function Calendar({loginResponse, setScreen}: {
    loginResponse: () => LoginResponse | null,
    setScreen: ({newScreen, newDate}: {newScreen: string, newDate?: string}) => void
}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startDay = firstDayOfMonth.getDay();

    const handleLogButtonPress = () => {
        setScreen({newScreen: 'meal', newDate: formatDate(currentYear, currentMonth, today.getDate())});
    }

    const validDate = (date: Date) => {
        const d1 = date;
        return d1 <= today;
    };

    const formatDate = (year: number, month: number, day: number) => {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const handleCurrentDate = () => {
        setCurrentMonth(today.getMonth());
        setCurrentYear(today.getFullYear());
    }

    const handleDayClick = (day: number) => {
        if (loading) return;
        const selectedDate = formatDate(currentYear, currentMonth, day);
        setScreen({newScreen: 'meal', newDate: selectedDate});
    };

    // Generate calendar grid
    const calendarDays = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
        calendarDays.push(
            <View key={`empty-${i}`} className="h-10 justify-center items-center" />
        );
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const isValid = validDate(new Date(currentYear, currentMonth, day));
        calendarDays.push(
            <TouchableOpacity
                key={day}
                className={`h-12 w-12 m-1 justify-center rounded items-center ${isValid ? 'background-light-gray' : 'background-gray'}`}
                onPress={() => isValid && handleDayClick(day)}
                disabled={!isValid || loading}
            >
                <Text className={`font-jomhuria text-3xl pt-1 ${isValid ? 'text-white' : 'text-gray-400'}`}>{day}</Text>
            </TouchableOpacity>
        );
    }

    // Split days into weeks
    const weeks = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
        weeks.push(
            <View key={i} className={`flex-row flex ${i < 7 ? 'justify-end' : 'justify-start'}`}>
                {calendarDays.slice(i, i + 7)}
            </View>
        );
    }

    const monthLabel = new Date(currentYear, currentMonth).toLocaleString('default', { 
        month: 'long', 
        year: 'numeric' 
    });

    return (
        <ScrollView className="flex-1 background-gray px-4 w-full" contentContainerClassName="flex-grow justify-start items-center">
            <Text className="text-3xl font-jomhuria text-white text-center mb-4">Select a date to start tracking</Text>
            
            {/* Month navigation */}
            <View className="flex-row items-center justify-center mb-4">
                <TouchableOpacity 
                    className="background-light-gray px-4 py-2 rounded"
                    onPress={handlePrevMonth}
                >
                    <Text className="text-white font-bold">&lt;</Text>
                </TouchableOpacity>
                
                <Text className="text-white text-4xl font-jomhuria mx-4 mt-1 min-w-48 text-center">{monthLabel}</Text>
                
                <TouchableOpacity 
                    className="background-light-gray px-4 py-2 rounded"
                    onPress={handleNextMonth}
                >
                    <Text className="text-white font-bold">&gt;</Text>
                </TouchableOpacity>
            </View>
            <View className={"flex flex-col items-center w-full"} style={{maxWidth: 330}}>
                {/* Days of week header */}
                <View className="flex-row mb-2 flex justify-center w-full">
                    {daysOfWeek.map(day => (
                        <View key={day} className="h-8 w-14 justify-center items-center">
                            <Text className="text-white font-jomhuria text-3xl">{day}</Text>
                        </View>
                    ))}
                </View>

                {/* Calendar weeks */}
                <View className="flex flex-col mb-4 justify-start" style={{minHeight: 300}}>
                    {weeks}
                </View>

                <View className={"flex flex-row justify-between w-full mb-8"}>
                    <TouchableOpacity onPress={() => handleCurrentDate()}>
                        <Text className={"font-jomhuria text-3xl text-red pt-1"}>Reset</Text>
                    </TouchableOpacity>
                    <RedButton title={" Start Logging Today's Meals "} onPress={handleLogButtonPress} />
                </View>
            </View>

            {/* Error and loading states */}
            {error && <Text className="text-red-500 text-center mb-4">{error}</Text>}
            {loading && <Text className="text-blue-500 text-center mb-4">Loading...</Text>}
        </ScrollView>
    );
}

export default Calendar;