import {
    List,
    Datagrid,
    TextField,
    ReferenceField,
    Edit,
    SimpleForm,
    ReferenceInput,
    SelectInput,
    TextInput,
    Create,
    SelectField,
    NumberField,
    ArrayInput,
    FormDataConsumer,
    SimpleFormIterator,
    TranslatableInputs,
    NumberInput,
    TabbedShowLayout, Tab,
    useDataProvider
} from 'react-admin';
import RichTextInput from 'ra-input-rich-text';
import { dot2obj } from 'libs/helper';
import { validate } from 'libs/validator';
import {
  COMPETENCY_RULES_INT,
  EXPERIENCE_RULES_INT,
  MOTIVATION_RULES_INT,
  HARD_SKILL_RULES_INT,
  CULTURE_FIT_RULES_INT
} from 'libs/scoring-board-rules';
import { i18n } from 'libs/config';
import { v4 as uuidv4 } from 'uuid';

import { makeStyles } from '@material-ui/core/styles';
import { useEffect, useState, useMemo } from 'react';

const validateForm = values => {
  const { type, subtype } = values;

  const rules = {
    'name.en': 'required',
    companyId: 'required',
    type: 'required|in:evaluation,screening,other',
    subtype: 'required'
  }

  if (type == 'evaluation') {
    if (['criteria', 'hard-skill', 'experience'].indexOf(subtype) > -1) {
      rules['criteriaId'] = 'required';
    }

    rules['rules'] = 'required|size:5'
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

const questionFilters = [
    <TextInput label="Name" source="name" alwaysOn />,
     <SelectInput source="type" choices={[
        { id: 'evaluation', name: 'Evaluation' },
        { id: 'screening', name: 'Screening' },
        { id: 'other', name: 'Other' }
     ]} alwaysOn />,
     <SelectInput source="subtype" choices={[
      { id: 'competency', name: 'Competency' },
      { id: 'experience', name: 'Experience' },
      { id: 'hard-skill', name: 'Hard skill' },
      { id: 'culture', name: 'Culture' },
      { id: 'motivation', name: 'Motivation' },
      { id: 'choice', name: 'Yes/No' },
      { id: 'multichoice', name: 'Multichoice' },
      { id: 'range', name: 'Range' },
      { id: 'text', name: 'Text' }
   ]} alwaysOn />,
     <ReferenceInput label="Company" source="companyId" reference="companies" alwaysOn>
       <SelectInput optionText="name" />
    </ReferenceInput>
];

const questionTypes = [
  { id: 'evaluation', name: 'Evaluation' },
  { id: 'screening', name: 'Screening' },
  { id: 'other', name: 'Other' }
]

const evaluationQuestionSubtypes = [
  { id: 'competency', name: 'Competency' },
  { id: 'experience', name: 'Experience' },
  { id: 'hard-skill', name: 'Hard skill' },
  { id: 'motivation', name: 'Motivation' },
  { id: 'culture', name: 'Culture' }
]

const screeningQuestionSubtypes = [
  { id: 'choice', name: 'Yes/No' },
  { id: 'multichoice', name: 'Multichoice' },
  { id: 'range', name: 'Range' }
]

const otherQuestionSubtypes = [
  { id: 'text', name: 'Text' }
]

const questionSubtypes = [
  ...evaluationQuestionSubtypes,
  ...screeningQuestionSubtypes,
  ...otherQuestionSubtypes
]

const defaultEvaluationRules = {
  'competency': COMPETENCY_RULES_INT,
  'hard-skill': HARD_SKILL_RULES_INT,
  'experience': EXPERIENCE_RULES_INT,
  'motivation': MOTIVATION_RULES_INT,
  'culture': CULTURE_FIT_RULES_INT
}

export const QuestionsList = props => (
    <List {...props} filters={questionFilters} sort={{ field: 'createdAt', order: 'desc' }} perPage={25}>
        <Datagrid rowClick="edit">
            <TextField source="name.en" label="Name" />
            <SelectField source="type" label="Type" choices={questionTypes} />
            <SelectField source="subtype" label="Subtype" choices={questionSubtypes} />
            <ReferenceField label="Company" source="companyId" reference="companies">
              <TextField source="name" />
            </ReferenceField>

            <NumberField source="followupCount" label="Follow-up" />

            <ReferenceField label="Criteria" source="criteria.id" reference="criteriaOptions">
              <TextField source="name.en" />
            </ReferenceField>
          
        </Datagrid>
    </List>
);

export const QuestionsEdit = props => {
  const dataProvider = useDataProvider();

  const [formValues, setValues] = useState({
   companyId: 'asker'
  })

  const initialValues = useMemo(() => {
   const { type, subtype } = formValues;

   if (type == 'evaluation' && subtype) {
     formValues.rules = defaultEvaluationRules[subtype]
   } else {
     delete formValues.rules
   }

   return {
     ...formValues
   }
  }, [formValues])


  const beforeSave = async (data) => {
   if (data.type == 'evaluation') {
     data.followup = data.followup || [];
     data.followupCount = data.followup.length;

     if (data.criteriaId) {
       const { data: criteria} = await dataProvider.getOne(
         'criteriaOptions',
         { id: data.criteriaId }
       );

       if (!criteria) {
         throw new Error("Criteria invalid")
       }

       data.criteria = criteria
     }
   } else {
     if (data.answers) {
       data.answers = data.answers.map(q => ({
         ...q,
         uid: uuidv4()
       }))
     }
   }

   return data;
  }

    return <Edit transform={beforeSave} {...props}>
   <SimpleForm redirect="list" validate={validateForm} initialValues={initialValues}>
 
 <ReferenceInput label="Company" source="companyId" reference="companies" sort={{field: 'name', order: 'ASC'}}>
     <SelectInput optionText="name" />
   </ReferenceInput>

   <SelectInput source="type" label="Type" choices={questionTypes} />

   <FormDataConsumer>
         {({ formData }) => {
           useEffect(() => {
             setValues(formData)
           }, [formData.type, formData.subtype])
         }}
   </FormDataConsumer>

   <FormDataConsumer>
         {({ formData }) => (
           <>
             {!formData.type ? <SelectInput disabled={true} allowEmpty={false} source="subtype" label="Subtype" choices={[]} /> : null}
             {formData.type == 'evaluation' ? <SelectInput allowEmpty={false} source="subtype" label="Subtype" choices={evaluationQuestionSubtypes} /> : null}
             {formData.type == 'screening' ? <SelectInput allowEmpty={false} source="subtype" label="Subtype" choices={screeningQuestionSubtypes} /> : null}
             {formData.type == 'other' ? <SelectInput allowEmpty={false} source="subtype" label="Subtype" choices={otherQuestionSubtypes} /> : null}
           </>)}
   </FormDataConsumer>

   <TranslatableInputs locales={i18n.locales.reverse()}>
         <TextInput source="name" label="Name" />
         <RichTextInput multiline={true}  source="desc" label="Description" />
         <RichTextInput multiline={true}  source="note" label="Note for interviewer" />
   </TranslatableInputs>

   <FormDataConsumer>
       {({ formData }) => (
         <>
             {(formData.type == 'screening' || formData.type == 'other') && formData.subtype ?
             <TabbedShowLayout>
               {formData.subtype == 'choice' || formData.subtype == 'multichoice' ? <Tab label="Answers">
                 <ArrayInput source="answers" label="Answers">
                   <SimpleFormIterator>
                       <TextInput source="name.en" label="EN" />
                       <TextInput source="name.se" label="SE" />
                   </SimpleFormIterator>
                 </ArrayInput>
                 </Tab> : null}

                 {formData.subtype == 'range' ? <Tab label="Setup">
                 <NumberInput source="min" label="Min" defaultValue={0} min={0} max={99999} />
                 <NumberInput source="max" label="Max" defaultValue={10} min={0} max={99999}  />
                 <NumberInput source="step" label="Step" defaultValue={1} />
                 <TextInput source={"unit"} label="Unit" defaultValue={'m'} />
               </Tab> : null}
             </TabbedShowLayout> : null}

             {formData.type == 'evaluation' && formData.subtype ?
             <TabbedShowLayout>
               {['competency', 'hard-skill', 'experience'].indexOf(formData.subtype) > -1 ? 
               <Tab label="Criteria">

               <ReferenceInput label="Criteria" source="criteriaId" reference="criteriaOptions" filter={{
               companyId: ['asker', formData.companyId],
               type: formData.subtype
               }}>
               <SelectInput allowEmpty={false} optionText="name.en" />
               </ReferenceInput></Tab>
               : null}

                 <Tab label="Follow-up">
                 <ArrayInput source="followup">
                 <SimpleFormIterator>
                     <TextInput source='en' label='EN' />
                     <TextInput source='se' label='SE' />
                 </SimpleFormIterator>
             </ArrayInput>
                 </Tab>

                 <Tab label="Rules">                         
                       <ArrayInput allowEmpty={false} source="rules" label="Rules" defaultValue={defaultEvaluationRules[formData.subtype]} >
                         <SimpleFormIterator disableRemove={true}  disableAdd={true}>
                             <TextInput source="name.en" label="Name (EN)" />
                             <TextInput source="name.se" label="Name (SE)" />
                             <ArrayInput source="steps" label="Steps">
                             <SimpleFormIterator disableRemove={true} disableAdd={true}>
                               <RichTextInput multiline={true} source="en" label="EN" />
                               <RichTextInput multiline={true} source="se" label="SE" />
                             </SimpleFormIterator>
                           </ArrayInput>
                         </SimpleFormIterator>
                       </ArrayInput>
                 </Tab>
               </TabbedShowLayout> : null}
           </>
         )}
   </FormDataConsumer>
 </SimpleForm>
    </Edit>
}

export const QuestionsAdd = props => {
     const dataProvider = useDataProvider();

     const [formValues, setValues] = useState({
      companyId: 'asker'
     })

     const initialValues = useMemo(() => {
      const { type, subtype } = formValues;

      if (type == 'evaluation' && subtype) {
        formValues.rules = defaultEvaluationRules[subtype]
      } else {
        delete formValues.rules
      }

      return {
        ...formValues
      }
     }, [formValues])


     const beforeSave = async (data) => {
      if (data.type == 'evaluation') {
        data.followup = data.followup || [];
        data.followupCount = data.followup.length;

        if (data.criteriaId) {
          const { data: criteria} = await dataProvider.getOne(
            'criteriaOptions',
            { id: data.criteriaId }
          );

          if (!criteria) {
            throw new Error("Criteria invalid")
          }

          data.criteria = criteria
        }
      } else {
        if (data.answers) {
          data.answers = data.answers.map(q => ({
            ...q,
            uid: uuidv4()
          }))
        }
      }

      return data;
     }

    return <Create transform={beforeSave} {...props}>
        <SimpleForm redirect="list" validate={validateForm} initialValues={initialValues}>
 
        <ReferenceInput label="Company" source="companyId" reference="companies" sort={{field: 'name', order: 'ASC'}}>
            <SelectInput optionText="name" />
          </ReferenceInput>

          <SelectInput source="type" label="Type" choices={questionTypes} />

          <FormDataConsumer>
                {({ formData }) => {
                  useEffect(() => {
                    setValues(formData)
                  }, [formData.type, formData.subtype])
                }}
          </FormDataConsumer>

          <FormDataConsumer>
                {({ formData }) => (
                  <>
                    {!formData.type ? <SelectInput disabled={true} allowEmpty={false} source="subtype" label="Subtype" choices={[]} /> : null}
                    {formData.type == 'evaluation' ? <SelectInput allowEmpty={false} source="subtype" label="Subtype" choices={evaluationQuestionSubtypes} /> : null}
                    {formData.type == 'screening' ? <SelectInput allowEmpty={false} source="subtype" label="Subtype" choices={screeningQuestionSubtypes} /> : null}
                    {formData.type == 'other' ? <SelectInput allowEmpty={false} source="subtype" label="Subtype" choices={otherQuestionSubtypes} /> : null}
                  </>)}
          </FormDataConsumer>

          <TranslatableInputs locales={i18n.locales.reverse()}>
                <TextInput source="name" label="Name" />
                <RichTextInput multiline={true}  source="desc" label="Description" />
                <RichTextInput multiline={true}  source="note" label="Note for interviewer" />
          </TranslatableInputs>

          <FormDataConsumer>
              {({ formData }) => (
                <>
                    {formData.type == 'screening' && formData.subtype ?
                    <TabbedShowLayout>
                      {formData.subtype == 'choice' || formData.subtype == 'multichoice' ? <Tab label="Answers">
                        <ArrayInput source="answers" label="Answers">
                          <SimpleFormIterator>
                              <TextInput source="name.en" label="EN" />
                              <TextInput source="name.se" label="SE" />
                          </SimpleFormIterator>
                        </ArrayInput>
                        </Tab> : null}

                        {formData.subtype == 'range' ? <Tab label="Setup">
                        <NumberInput source="min" label="Min" defaultValue={0} min={0} max={99999} />
                        <NumberInput source="max" label="Max" defaultValue={10} min={0} max={99999}  />
                        <NumberInput source="step" label="Step" defaultValue={1} />
                        <TextInput source={"unit"} label="Unit" defaultValue={'m'} />
                      </Tab> : null}
                    </TabbedShowLayout> : null}

                    {formData.type == 'evaluation' && formData.subtype ?
                    <TabbedShowLayout>
                      {['competency', 'hard-skill', 'experience'].indexOf(formData.subtype) > -1 ? 
                      <Tab label="Criteria">

                      <ReferenceInput label="Criteria" source="criteriaId" reference="criteriaOptions" filter={{
                      companyId: ['asker', formData.companyId],
                      type: formData.subtype
                      }}>
                      <SelectInput allowEmpty={false} optionText="name.en" />
                      </ReferenceInput></Tab>
                      : null}

                        <Tab label="Follow-up">
                        <ArrayInput source="followup">
                        <SimpleFormIterator>
                            <TextInput source='en' label='EN' />
                            <TextInput source='se' label='SE' />
                        </SimpleFormIterator>
                    </ArrayInput>
                        </Tab>

                        <Tab label="Rules">                         
                              <ArrayInput allowEmpty={false} source="rules" label="Rules" defaultValue={defaultEvaluationRules[formData.subtype]} >
                                <SimpleFormIterator disableRemove={true}  disableAdd={true}>
                                    <TextInput source="name.en" label="Name (EN)" />
                                    <TextInput source="name.se" label="Name (SE)" />
                                    <ArrayInput source="steps" label="Steps">
                                    <SimpleFormIterator disableRemove={true} disableAdd={true}>
                                      <RichTextInput multiline={true} source="en" label="EN" />
                                      <RichTextInput multiline={true} source="se" label="SE" />
                                    </SimpleFormIterator>
                                  </ArrayInput>
                                </SimpleFormIterator>
                              </ArrayInput>
                        </Tab>
                      </TabbedShowLayout> : null}
                  </>
                )}
          </FormDataConsumer>
        </SimpleForm>
    </Create>
}
