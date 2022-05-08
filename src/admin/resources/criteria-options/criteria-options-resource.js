import {
    List,
    Datagrid,
    TextField,
    ReferenceField,
    EditButton,
    Edit,
    SimpleForm,
    ReferenceInput,
    SelectInput,
    TextInput,
    TabbedShowLayout,
    Tab,
    RichTextField,
    TranslatableInputs,
    Create,
    TextareaField,
    TextareaInput,
    UrlInput,
    EmailField,
    EmailInput,
    ImageInput,
    NumberInput,
    PasswordInput,
    SelectField,
    BooleanField,
    ChipField,
    BooleanInput
} from 'react-admin';
import RichTextInput from 'ra-input-rich-text';
import { dot2obj, localize } from 'libs/helper';
import { validate } from 'libs/validator';
import ImageField from 'admin/fields/image/image-field';

import AlarmOnIcon from '@material-ui/icons/AlarmOn';
import AlarmOffIcon from '@material-ui/icons/AlarmOff';

import { makeStyles } from '@material-ui/core/styles';

const validateForm = values => {
  const rules = {
    name: 'required',
    companyId: 'required',
    type: 'in:competency,experience,hard-skill'
  }

  const errors = validate(values, rules)

  if (errors) {
    return dot2obj(errors);
  }
}

const useStyles = makeStyles({
    textInput: {
        width: '900px'
    }
  })

const criteriaOptionFilters = [
    <TextInput label="Name" source="name" alwaysOn />,
     <SelectInput source="type" choices={[
        { id: 'competency', name: 'Competency' },
        { id: 'experience', name: 'Experience' },
        { id: 'hard-skill', name: 'Hard-skill' }
     ]} alwaysOn />,
     <ReferenceInput label="Company" source="companyId" reference="companies" alwaysOn>
       <SelectInput optionText="name" />
    </ReferenceInput>
];

export const CriteriaOptionsList = props => (
    <List {...props} filters={criteriaOptionFilters} sort={{ field: 'name', order: 'asc' }} perPage={25}>
        <Datagrid rowClick="edit">
            <TextField source="name" label="Name" />
            <SelectField source="type" title="Type" choices={[
              { id: 'competency', name: 'Competency' },
              { id: 'experience', name: 'Experience' },
              { id: 'hard-skill', name: 'Hard-skill' }
            ]} />
            <ReferenceField label="Company" source="companyId" reference="companies">
              <TextField source="name" />
            </ReferenceField>
        </Datagrid>
    </List>
);

const languages = [
  { locale: 'en', title: 'English' }
]

export const CriteriaOptionsEdit = props => {
     const classes = useStyles();

    return <Edit {...props}>
        <SimpleForm validate={validateForm}>
          <TextInput source="name" label="Name" />
          <RichTextInput multiline={true}  source="desc" label="Definition" />
          <SelectInput source="type" title="Type" choices={[
            { id: 'competency', name: 'Competency' },
            { id: 'experience', name: 'Experience' },
            { id: 'hard-skill', name: 'Hard-skill' }
          ]} />
          <ReferenceInput label="Company" source="companyId" reference="companies">
            <SelectInput optionText="name" />
          </ReferenceInput>
        </SimpleForm>
    </Edit>
}

export const CriteriaOptionsAdd = props => {
     const classes = useStyles();

    return <Create {...props}>
        <SimpleForm redirect="list" validate={validateForm}>
          <TextInput source="name" label="Name" />
          <RichTextInput multiline={true} source="desc" label="Definition" />
          <SelectInput source="type" title="Type" choices={[
            { id: 'competency', name: 'Competency' },
            { id: 'experience', name: 'Experience' },
            { id: 'hard-skill', name: 'Hard-skill' }
          ]} />
          <ReferenceInput label="Company" source="companyId" reference="companies">
            <SelectInput optionText="name" />
          </ReferenceInput>
        </SimpleForm>
    </Create>
}
