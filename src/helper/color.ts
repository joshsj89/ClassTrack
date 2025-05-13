export type ColorPickerProps = {
    label: string;
    selectedColor: EventColor;
    onColorChange: (color: EventColor) => void;
};

export enum EventColor {
    PaleBlue = "1",
    Peacock = "1",
    PaleGreen = "2",
    Sage = "2",
    Mauve = "3",
    Grape = "3",
    PaleRed = "4",
    Flamingo = "4",
    Yellow = "5",
    Banana = "5",
    Orange = "6",
    Tangerine = "6",
    Cyan = "7",
    Lavender = "7",
    Gray = "8",
    Graphite = "8",
    Blue = "9",
    Blueberry = "9",
    Green = "10",
    Basil = "10",
    Red = "11",
    Tomato = "11"
};

export enum EventColorHex {
    PaleBlue = "#039BE5",
    Peacock = "#039BE5",
    PaleGreen = "#33B679",
    Sage = "#33B679",
    Mauve = "#8E24AA",
    Grape = "#8E24AA",
    PaleRed = "#E67C73",
    Flamingo = "#E67C73",
    Yellow = "#F6BF26",
    Banana = "#F6BF26",
    Orange = "#F4511E",
    Tangerine = "#F4511E",
    Cyan = "#7986CB",
    Lavender = "#7986CB",
    Gray = "#616161",
    Graphite = "#616161",
    Blue = "#3F51B5",
    Blueberry = "#3F51B5",
    Green = "#0B8043",
    Basil = "#0B8043",
    Red = "#D50000",
    Tomato = "#D50000"
};

export function getHexFromEventColor(color: EventColor): string | undefined {
    const matchingName = Object.entries(EventColor).find(
        ([_, val]) => val === color
    )?.[0];

    return matchingName ? EventColorHex[matchingName as keyof typeof EventColorHex] : undefined;
}

export function getEventColorFromHex(hex: string): EventColor | undefined {
    const matchingName = Object.entries(EventColorHex).find(
        ([_, val]) => val === hex
    )?.[0];

    return matchingName ? EventColor[matchingName as keyof typeof EventColor] : undefined;
}