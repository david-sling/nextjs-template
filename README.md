# Next JS starter template

## Assets

### Images

Any image to be embedded inside the `<Image/ >` tag

1. Add the image file to `src/assets/images` (using `logo.png` as example)
2. Add the following lines to `src/assets/images/index.tsx`

```tsx
import logo from "./logo.png";
export const Logo = createImage(logo, "Logo");
```

3. Use the image in any react component like below:

```tsx
<Logo />
```

### Icons

Export tsx components from inside the `src/assets/icons` folder using the [svgr tool](https://react-svgr.com/playground/?memo=true&typescript=true)

## Fonts

To add a new font to the project:

1. Create and place the fonts inside a `src/fonts/<font-name>` folder
2. Export a new `localFont` from `src/fonts/config.ts`
3. Import and use the `className` property wherever necessary.

## Services

All API calls must be made from within the `src/services` folder

1. Create a new file for any group of similar services eg: `src/services/example.ts`
2. Export a new service function like below:

```ts
export const exampleService = createFetcher<
    ResponseBody,
    RequestBody,
    RequestUrlParams,
    RequestQueryParams,
>({
    url: string | (p:RequestUrlParams) => string,
    ...allAxiosProps
})
```

3. Use the function like below:

```ts
const responseBody = await exampleService({
  data: requestBody,
  params: requestQueryParams,
  urlParams: requestUrlParams,
  ..allAxiosProps // will override the props passed to `createFetcher`
});
```

## Hooks

### `useAsyncEffect`

```tsx
useAsyncEffect(effect, deps, destructor);
```

| Variable    | Type                  | Explanation                                   | Required |
| ----------- | --------------------- | --------------------------------------------- | -------- |
| effect      | `() => Promise<void>` | runs whenever contents of `deps` change       | Yes      |
| deps        | `any[]`               | triggers `effect` whenever its content change | Yes      |
| desctructor | `() => Promise<any>`  | runs when the parent component is destoryed   | No       |

### `useAsyncMemo`

```tsx
const [value, { set, refresh, fetch, loading }] = useAsyncMemo(effect, deps, {
  defaultValue,
  storeLocal,
  desctructor,
});
```

#### Input Variables:

| Variable     | Type                          | Explanation                                                                                                    | Required |
| ------------ | ----------------------------- | -------------------------------------------------------------------------------------------------------------- | -------- |
| effect       | `(prevValue:T) => Promise<T>` | An async function whose return value is stored in `value` variable. It also have the previous value of `value` | Yes      |
| deps         | `any[]`                       | any change here triggers `effect` to run again and update `value`                                              | Yes      |
| defaultValue | `T`                           | `value` is initialised with this prop and stays the same until the `effect()` promise resolves                 | No       |
| storeLocal   | `string`                      | If passed, will store `value` to localStorage using the passed string as the key and retain it on page reload  | No       |
| destructor   | `() => void`                  | Runs when the parent component is destroyed                                                                    | No       |

#### Output Variables

| Variable | Type                          | Explanation                                                                                            |
| -------- | ----------------------------- | ------------------------------------------------------------------------------------------------------ |
| value    | `T`                           | the state returned by `effect`                                                                         |
| set      | `Dispatch<SetStateAction<T>>` | the set state function for the `value` state                                                           |
| loading  | `boolean`                     | indicated if the async function `effect` is currently being executed                                   |
| refresh  | `() => void`                  | triggers `effect` to run again and update `value`. Also changes `loading` to `true` during the process |
| fetch    | `() => void`                  | same as `refresh` but does not change `loading` state                                                  |

### `useForm`

#### Example usage:

```tsx
import { TextField } from "@/components/FormElements/TextField";
import { Select } from "@/components/FormElements/Select";
import { Switch } from "@/components/FormElements/Switch";

import { useForm } from "@/hooks/useForm";

import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().required(),
  isPresent: yup.boolean(),
});

const FormComponent = () => {
  const formProps = useForm({
    initialValue: {
      name: "",
      isPresent: false,
      role: "student",
    },
    schema,
  });
  const { register } = formProps;

  return (
    <>
      <TextField label="Name" {...register("name")} />
      <Switch {...register("isPresent")} />
      <Select
        options={[
          { value: "student", label: "Student" },
          { value: "teacher", label: "Teacher" },
        ]}
        identifier={(i) => i.item.value} // should return a string
        {...register("role")}
      />
    </>
  );
};
```

#### Creating Custom input components compatible with `useForm().register`

```tsx
import { FC } from "react";
import { Registered } from "@/hooks/useForm";
import { ErrorMessage } from "@/components/FormElements/ErrorMessage";

interface Props extends Registered<custom_type> {
  // more props if needed
}

export const CustomInput: FC<Props> = ({ value, onChange, ...props }) => {
  return <div>
    {/** Custom UI using value and  **/}
    <ErrorMessage {...props}>
  </div>;
};
```

#### Using `useForm` with `FormProvider`:

```tsx
import { useForm, FormProvider, useFormContext } from "@/hooks/useForm";

interface FormShape {
  // form shape
}

const Parent = () => {
  const formProps = useForm<FormShape>({
    initialValue: {
      // should be `FormShape`
    },
  });

  return (
    <FormProvider {...formProps}>
        <Child />
    <FormProvider>
  );
};

const Child = () => {
    const fromProps = useFormContext<FormShape>()

    return //UI
}
```

Alternatively, we can use the following `Parent` component:

```tsx
import { Form } from "@/hooks/useForm";

const Parent = () => {
  return (
    <Form<FormShape>
      initialValue={
        {
          // should be `FormShape`
        }
      }
    >
      <Child />
    </Form>
  );
};
```
