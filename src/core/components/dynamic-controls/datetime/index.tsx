import { TextField } from '@mui/material';
import { FormComponentType } from '../../../types/FormComponentType';
import { Control, Controller, FieldValues, UseFormTrigger } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers';
import { isAfter, isBefore, isFuture, isSameDay, isValid } from 'date-fns';
import { useEffect } from 'react';

type Props = {
  component: FormComponentType;
  control: Control;
  watchFields?: FieldValues;
  trigger: UseFormTrigger<FieldValues>;
  beforeThanCustom?: Date;
  afterThanCustom?: Date;
};

const isAfterOrSame = (date: Date) => isAfter(date, new Date()) || isSameDay(date, new Date());

export const DynamicDatetime = ({ component, control, watchFields, trigger, beforeThanCustom, afterThanCustom }: Props) => {
  const { beforeThan } = component.properties ?? {};

  useEffect(() => {
    if (watchFields?.[beforeThan ?? '']) {
      trigger([component.key]);
    }
  }, [watchFields?.[beforeThan ?? '']]);

  return (
    <>
      <label>
        {component.label} {component.validate?.required && <span>*</span>}
      </label>
      <div className='form-control'>
        <Controller
          name={component.key}
          control={control}
          rules={{
            required: component.validate?.required ? component.validate.customMessage : undefined,
            validate: {
              min: (date) =>
                !isBefore(date, component.validate?.custom == 'minToday' ? new Date() : new Date('1900-01-01')) ||
                (component.errors?.min ?? component.errors?.required),
              valid: (date) => isValid(date) || component.errors?.required,
              ...(component.validate?.custom == 'notFuture' && {
                notFuture: (date) => !isFuture(date) || component.errors?.notFuture,
              }),
              ...(component.validate?.custom == 'notPast' && {
                notPast: (date) => isAfterOrSame(date) || component.errors?.notPast,
              }),
              ...(component.validate?.custom == 'notPast' && {
                notPast: (date) => isAfterOrSame(date) || component.errors?.notPast,
              }),
              ...(component.validate?.custom == 'justFuture' && {
                justFuture: (date) => isAfter(date, new Date()) || component.errors?.justFuture,
              }),
              ...(beforeThan && {
                beforeThan: (date) =>
                  watchFields?.[beforeThan] ? isBefore(date, watchFields?.[beforeThan]) || component.errors?.beforeThan : undefined,
              }),
              ...(beforeThanCustom && {
                beforeThan: (date) => isBefore(date, beforeThanCustom) || component.errors?.beforeThanCustom,
              }),
              ...(afterThanCustom && {
                afterThan: (date) => isAfter(date, afterThanCustom) || component.errors?.afterThanCustom,
              }),
            },
          }}
          render={({ field: { ref, onBlur, name, value = null, ...field }, fieldState }) => (
            <DatePicker
              {...field}
              value={value}
              inputRef={ref}
              inputFormat='dd/MM/yyyy'
              InputProps={{ placeholder: 'DD/MM/AAAA' }}
              renderInput={(params) => (
                <TextField {...params} onBlur={onBlur} name={name} error={!!fieldState.error} helperText={fieldState.error?.message} />
              )}
            />
          )}
        />
      </div>
    </>
  );
};
