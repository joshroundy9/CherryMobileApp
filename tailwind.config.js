/** @type {import('tailwindcss').Config} */
import { platformSelect } from "nativewind/theme";
module.exports = {
    // NOTE: Update this to include the paths to all files that contain Nativewind classes.
    content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            fontFamily: {
                'jomhuria': ['Jomhuria_400Regular', 'cursive'],
            },
        },
    },
    plugins: [],
}