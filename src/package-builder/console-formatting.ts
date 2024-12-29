export class ConsoleFormat {
   public readonly starting;
   public readonly ending;
   public constructor(starting: number, ending: number) {
      this.starting = `\x1b[${starting}m`;
      this.ending = `\x1b[${ending}m`;
   }
   public merge(other: ConsoleFormat): ConsoleFormat {
      return Object.setPrototypeOf(
         { ending: this.ending + other.ending, starting: this.starting + other.starting },
         ConsoleFormat.prototype,
      );
   }
}
export class ConsoleColorFormat extends ConsoleFormat {
   public readonly isBackground: 0 | 10;
   public readonly isLight: 0 | 60;
   public constructor(color: ConsoleColors, modifiers: ConsoleModifier | 70 | 0) {
      const isBackground = modifiers === 10 ? modifiers : modifiers === 70 ? 10 : 0;
      super(
         CONSOLE_COLOR_MODIFIERS.Base + color + modifiers,
         CONSOLE_COLOR_MODIFIERS.Base + isBackground + CONSOLE_COLORS.Reset,
      );
      this.isBackground = isBackground;
      this.isLight = modifiers >= 60 ? 60 : 0;
   }
}

export function f(strings: TemplateStringsArray, ...params: unknown[]) {
   return (...colors: ConsoleFormat[]) => {
      const color = colors.reduce((l, n) => l.merge(n));
      return (
         color.starting +
         params.map((e, i) => `${strings[i]}${color.starting}${e}`).join(color.starting) +
         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
         strings[strings.length - 1]! +
         color.ending
      );
   };
}
export function use(data: unknown, color: ConsoleFormat) {
   return `${color.starting}${data}${color.ending}`;
}
export function fit(data: string, size: number) {
   if (data.length < size) return data + ' '.repeat(size - data.length);
   return data;
}

type ConsoleColors = (typeof CONSOLE_COLORS)[Colors];
type ConsoleModifier =
   | typeof CONSOLE_COLOR_MODIFIERS.BackgroundModifier
   | typeof CONSOLE_COLOR_MODIFIERS.LightModeModifier;

const CONSOLE_COLORS = {
   Black: 0,
   Red: 1,
   Green: 2,
   Yellow: 3,
   Blue: 4,
   Magenta: 5,
   Cyan: 6,
   White: 7,
   Custom: 8,
   Reset: 9,
} as const;

const CONSOLE_COLOR_MODIFIERS = {
   Base: 30,
   BackgroundModifier: 10,
   LightModeModifier: 60,
} as const;

type ConsoleColorFormatsObject = {
   readonly Dark: ConsoleFormat;
   readonly Italic: ConsoleFormat;
   readonly Underline: ConsoleFormat;
   readonly DoubleUnderline: ConsoleFormat;
   readonly Blink: ConsoleFormat;
   readonly Inverted: ConsoleFormat;
   readonly Censured: ConsoleFormat;
   readonly Canceled: ConsoleFormat;
} & { [K in Colors]: ConsoleFormat } & {
   [K in Colors as `Background${K}`]: ConsoleFormat;
} & { [K in Colors as `Light${K}`]: ConsoleFormat } & {
   [K in Colors as `BackgroundLight${K}`]: ConsoleFormat;
};

type Colors = keyof typeof CONSOLE_COLORS;

export const Formats: ConsoleColorFormatsObject = {
   Dark: new ConsoleFormat(2, 22),
   Italic: new ConsoleFormat(3, 23),
   Underline: new ConsoleFormat(4, 24),
   DoubleUnderline: new ConsoleFormat(21, 24),
   Blink: new ConsoleFormat(5, 25),
   Inverted: new ConsoleFormat(7, 27),
   Censured: new ConsoleFormat(8, 28),
   Canceled: new ConsoleFormat(9, 29),
} as ConsoleColorFormatsObject;

for (const key of Object.getOwnPropertyNames(CONSOLE_COLORS) as Colors[]) {
   Formats[`Light${key}`] = new ConsoleColorFormat(CONSOLE_COLORS[key], CONSOLE_COLOR_MODIFIERS.LightModeModifier);

   Formats[`BackgroundLight${key}`] = new ConsoleColorFormat(
      CONSOLE_COLORS[key],
      (CONSOLE_COLOR_MODIFIERS.LightModeModifier + CONSOLE_COLOR_MODIFIERS.LightModeModifier) as 70,
   );

   Formats[`Background${key}`] = new ConsoleColorFormat(
      CONSOLE_COLORS[key],
      CONSOLE_COLOR_MODIFIERS.BackgroundModifier,
   );

   Formats[key] = new ConsoleColorFormat(CONSOLE_COLORS[key], 0);
}

