import { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { isFuture, isValid } from 'date-fns';

import { Select, MenuItem, TextField, Button, FormGroup, FormControlLabel, Switch } from '@mui/material';
import AppsIcon from '@mui/icons-material/Apps';
import { MuiFileInput } from 'mui-file-input';

export const Demo = () => {
  const [, setMutating] = useState(false);

  const onClick = () => {
    console.log('mutating');
    setMutating(true);
  };

  const onSubmit = (data: any) => console.info(data);

  const {
    handleSubmit,
    formState: { errors },
    control,
    register,
    setValue,
  } = useForm({
    mode: 'all',
  });

  useEffect(() => {
    setValue('file', null);
  }, []);

  return (
    <div style={{ margin: '20px' }}>
      <h1>h1. Ejemplo de un h1</h1>
      <h2>h2. Ejemplo de un h2</h2>

      <a href=''>link</a>

      <p>paragraph</p>

      <div className='buttons' style={{ margin: '20px 0' }}>
        <Button variant='contained' onClick={onClick}>
          INICIAR
        </Button>
        <Button variant='outlined'>INICIAR</Button>
        <Button className='btn-icon' variant='contained' startIcon={<AppsIcon />}>
          INICIAR
        </Button>
        <Button className='btn-icon-outlined' variant='contained' startIcon={<AppsIcon />}>
          INICIAR
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='form-group'>
          <label>
            NOMBRE DE USUARIO <span>*</span>
          </label>
          <input type='text' className='form-control' />
          <small className='text-danger'>Nombre no válido</small>
        </div>

        <div className='form-group'>
          <label>
            GENERO <span>*</span>
          </label>
          <div className='form-control'>
            <Controller
              control={control}
              name='selection'
              defaultValue=''
              rules={{ required: 'Campo requerido' }}
              render={({ field }) => (
                <Select
                  {...field}
                  fullWidth
                  displayEmpty
                  renderValue={(value) => (value ? value : <span className='placeholder'>Seleccione el género</span>)}
                >
                  <MenuItem value='Option 1'>Option 1</MenuItem>
                  <MenuItem value='Option 2'>Option 2</MenuItem>
                  <MenuItem value='Option 3'>Option 3</MenuItem>
                  <MenuItem value='Option 4'>Option 4</MenuItem>
                </Select>
              )}
            />
          </div>
          {errors.selection && <small className='text-danger'>{errors?.selection?.message as string}</small>}
        </div>

        <div className='form-group'>
          <label>
            FECHA <span>*</span>
          </label>

          <div className='form-control'>
            <Controller
              control={control}
              name='fecha'
              rules={{
                required: 'Campo requerido',
                validate: {
                  valid: (date) => isValid(date) || 'Campo obligatorio',
                  isFuture: (date) => isFuture(date) || 'La fecha debe ser mayor a la fecha actual',
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
        </div>

        <div className='form-group'>
          <label>
            DESCRIPCIÓN GENERAL DE LA NECESIDAD <span>*</span>
          </label>
          <TextField
            placeholder='Utilice este espacio para indicar una breve descripción de la necesidad que requiere sea solventada por el proveedor'
            multiline
            rows={5}
            maxRows={5}
            {...register('description', {
              required: 'Campo descripción requerido',
            })}
          />
          {errors.description && <small className='text-danger'>{errors.description?.message as string}</small>}
        </div>

        <FormGroup>
          <FormControlLabel control={<Switch defaultChecked />} label='Gestionar como concurso' />
          <FormControlLabel disabled control={<Switch />} label='Disabled' />
        </FormGroup>

        <div className='form-group file'>
          <label>
            SOPORTE DEL REQUERIMIENTO <span className='required'>*</span>
          </label>
          <Controller
            name='file'
            rules={{ required: 'Campo soporte del requerimiento requerido' }}
            control={control}
            render={({ field, fieldState }) => (
              <MuiFileInput {...field} helperText={fieldState.error?.message} placeholder={'Documento de soporte del requerimiento'} />
            )}
          />
        </div>

        <div className='mt-1'>
          <Button type='submit' variant='contained'>
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};
