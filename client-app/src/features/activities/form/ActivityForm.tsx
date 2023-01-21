import { observer } from "mobx-react-lite";
import { useState , ChangeEvent, useEffect} from "react";
import { Link, useParams } from 'react-router-dom';
import { Button, Segment, Header } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponents";
import { Activity } from "../../../app/Models/activity";
import { useStore } from "../../../app/stores/store";
import {v4 as uuid} from 'uuid';
import {Formik, Form} from 'formik';
import * as Yup from 'yup';
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import MyDateInput from "../../../app/common/form/MyDateInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
 
export default observer( function ActivityForm(){

    const history = [];
    const {activityStore} = useStore();
    const { createActivity, updateActivity, 
        loading, loadActivity, loadingInitial} = activityStore;
    const {id} =useParams();

    const [activity, setActivity] = useState<Activity>({
        id:'',
        title: '',
        category: '',
        description: '',
        date: null,
        city: '',
        venue: ''
    });

    useEffect(() =>{
        if(id) loadActivity(id).then(activity => setActivity(activity!))
    }, [id, loadActivity])

    const validationSchema = Yup.object({
        title: Yup.string().required('The activity title is required'),
        description: Yup.string().required('The activity description is required'),
        category: Yup.string().required(),
        date: Yup.string().required('Date is required').nullable(),
        venue: Yup.string().required(),
        city: Yup.string().required()
    })

    function handleFormSubmit(activity: Activity){
        if(!activity.id){
            activity.id = uuid();
            createActivity(activity).then(() => history.push(`/activities/${activity.id}`));
        }else{
            updateActivity(activity).then(() => history.push(`/activities/${activity.id}`));
        }

    }

    // function handleChange(event:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){
    //     const {name, value} = event.target;
    //     setActivity ({...activity, [name]:value})
    // }

    if(loadingInitial) return <LoadingComponent content="Loading activity..."/>
     return(
        <Segment clearing>
            <Header content='Activity Details' sub color="teal" />
            <Formik 
            validationSchema={validationSchema}
            enableReinitialize 
            initialValues={activity} 
            onSubmit={values => handleFormSubmit(values)}>
                {({handleSubmit, isValid, isSubmitting, dirty}) => (
                            <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                                 <MyTextInput name='title' placeholder="Title" />   
                                <MyTextArea rows={3} placeholder='Desciption' name='description' ></MyTextArea>
                                <MySelectInput options={categoryOptions} placeholder='Category' name='category' ></MySelectInput>
                                <MyDateInput
                                 placeholderText='Date' 
                                 name='date' 
                                 showTimeSelect
                                 timeCaption='time'
                                 dateFormat='MMMM d, yyyy h:mm aa'
                                 />
                                 <Header content='Location Details' sub color="teal" />
                                <MyTextInput placeholder='City'  name='city' ></MyTextInput>
                                <MyTextInput placeholder='Venue' name='venue' ></MyTextInput>
                                <Button 
                                disabled={isSubmitting || !dirty || !isValid}
                                loading={loading} floated="right" 
                                positive type="submit" content="Submit"/>
                                <Button as={Link} to='/activities' floated="right" positive type="button" content="Cancel"/>
                            </Form>
                )}
            </Formik>
        </Segment>
    )
})