

import { useEffect, useState, useRef } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import { NormalInput, Normalselect, NormalButton } from '../../../common';
import { USER_TYPE } from '../../../../services/constants';
import { createAuthentication, updateUser } from '../../../../api/auth';
import { userObj } from '../../../../services/entity/user';
import { isEmpty } from '../../../../services/helperFunctions';


export const UsersFrom = ({ toggle, editFormObj }) => {
    const simpleValidator = useRef(new SimpleReactValidator({ className: "error-message", }));
    const [, forceUpdate] = useState();
    const [isFormLoader, setIsFormLoader] = useState(false)
    const [userFormObj, setUserFormOb] = useState({ ...userObj });



    useEffect(() => {

        if (!isEmpty(editFormObj)) {
            setUserFormOb({ ...editFormObj })
        }

    }, [])

    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        setUserFormOb({
            ...userFormObj,
            [name]: value
        })


    }


    const handleFormSubmit = () => {
        const formValid = simpleValidator.current.allValid();

        if (formValid) {

            try {
                console.log('userFormObj.hasOwnProperty("id")-------------->',userFormObj.hasOwnProperty("id"))
                setIsFormLoader(true)
                let apiCall = userFormObj.hasOwnProperty("id") ? updateUser({...userFormObj},userFormObj?.id) : createAuthentication(userFormObj);
                apiCall.then((data) => {
                    setIsFormLoader(false)

                    handleCloseModal('success');
                }).catch((error) => {
                    setIsFormLoader(false)
                });

            } catch (e) {
                setIsFormLoader(false)
            }

        } else {
            simpleValidator.current.showMessages();
            forceUpdate(1);
        }
    }

    const handleCloseModal = () => {
        toggle('success');
        setUserFormOb({ ...userObj })
    }

    return (
        <div className='row'>
            <div className='col-md-6 mt-3'>
                <NormalInput label='First Name' value={userFormObj?.first_name} name='first_name' onChange={handleInputChange}
                    errorMessage={simpleValidator.current.message("First Name", userFormObj?.first_name, "required")}
                />
            </div>
            <div className='col-md-6 mt-3'>
                <NormalInput label='Last Name' value={userFormObj?.last_name} name='last_name' onChange={handleInputChange}
                    errorMessage={simpleValidator.current.message("Last Name", userFormObj?.last_name, "required")}
                />
            </div>
            <div className='col-md-6'>
                <NormalInput label='Email' value={userFormObj?.emailid} name='emailid' onChange={handleInputChange}
                    errorMessage={simpleValidator.current.message("Email", userFormObj?.emailid, "required|email")}
                />
            </div>
            <div className='col-md-6'>
                <NormalInput label='Phone' value={userFormObj?.mobile} name='mobile' onChange={handleInputChange}
                    errorMessage={simpleValidator.current.message("Phone", userFormObj?.mobile, "required|phone")}
                />
            </div>
            <div className='col-md-6'>
                <Normalselect label='User Type' options={USER_TYPE} value={userFormObj?.user_type} name='user_type' onChange={handleInputChange}
                    errorMessage={simpleValidator.current.message("User Type", userFormObj?.user_type, "required")}
                />
            </div>

            <div className='col-md-6'>
                <NormalInput type='password' disabled={userFormObj.hasOwnProperty("id")} label='Password' value={userFormObj?.password} name='password' onChange={handleInputChange}
                    errorMessage={simpleValidator.current.message("Password", userFormObj?.password, "required")}
                />
            </div>
            <div className='col-md-12'>
                <NormalButton label='Cancel' onClick={handleCloseModal} disabled={isFormLoader} color="error" className='me-2' />
                <NormalButton label={userFormObj.hasOwnProperty("id")?'Update':'Save'} isLoader={isFormLoader} onClick={handleFormSubmit} />
            </div>
        </div>
    );




}
