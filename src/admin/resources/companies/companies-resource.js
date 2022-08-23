import {
    List,
    Datagrid,
    TextField,
    Edit,
    SimpleForm,
    TextInput,
    Create,
    ImageInput,
    useLocale
} from 'react-admin';
import { validate } from 'libs/validator';
import { makeStyles } from '@material-ui/core/styles';
import { dot2obj } from 'libs/helper';
import ImageField from 'admin/fields/image/image-field';
import { FunctionField } from 'react-admin';

const useStyles = makeStyles({
    textInput: {
        width: '900px'
    }
  })

const validateForm = values => {
  const errors = validate(values, {
    name: 'required'
  })

  return dot2obj(errors)
}

const companyFilters = [
    <TextInput label="Name" source="name" alwaysOn />
];

export const CompaniesList = props => {
    const locale = useLocale();

    return <List filters={companyFilters} sort={{ field: 'createdAt', order: 'desc' }} {...props} perPage={25}>
        <Datagrid rowClick="edit">
            <TextField source="name" label="Name"  />
            <ImageField alwaysSingle={true} source="images" src="src" title="title" />
            <TextField source="projectCount" label="Projects"  />
            <TextField source="projectStageAvg" label="Stages (avg. pp.)"  />
            <TextField source="projectInterviewAvg" label="Interviews (avg. pp.)"  />
            <FunctionField source="projectInterviewCompleteP" label="Interviews complete" render={rec => `${rec.projectInterviewCompleteP || 0}%`} />
            <FunctionField source="projectInterviewCompleteScoreAvg" label="Score (avg. %)" render={rec => `${rec.projectInterviewCompleteScoreAvg || 0}%`}  />
            <TextField source="templateCount" label="Templates"  />
            <TextField source="questionCount" label="Questions"  />
            <TextField source="userCount" label="Users"  />
        </Datagrid>
    </List>
};

export const CompaniesEdit = props => {
     const classes = useStyles();

    return <Edit {...props}>
        <SimpleForm validate={validateForm}>
            <TextInput source="name" label="Name" />
            <ImageInput source="images" multiple={true}>
              <ImageField source="src" title="title" />
            </ImageInput>
        </SimpleForm>
    </Edit>
}

export const CompaniesAdd = props => {
     const classes = useStyles();

    return <Create {...props}>
        <SimpleForm redirect='list' validate={validateForm}>
          <TextInput source="name" label="Name" />
          <ImageInput source="images" label="Logo" multiple={true}>
            <ImageField source="src" title="title" />
          </ImageInput>
          <TextInput source="id" label="Identifier" helperText="99% cases you would leave this empty" />
        </SimpleForm>
    </Create>
}
