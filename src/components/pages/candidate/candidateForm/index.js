
import { useEffect, useState, useRef } from 'react';

import { NormalButton, NormalInput, Normalselect, NormalCheckbox } from '../../../common';
import { candidateFormObj, joinedCoursesObj } from '../../../../services/entity'
import { CANDIDATE_COURSE_STATUS, COURSE_LIST, CLASS_TYPE, YES_NO, INSTITUTE_BRANCH, WEEK_LIST,USER_ROLE } from '../../../../services/constants'
import SimpleReactValidator from 'simple-react-validator';
import { createCandidate, updateCandidate } from '../../../../api/candidate';
import { getBatchList } from '../../../../api/masters';
import { getAllUser } from '../../../../api/user';

import { isEmpty,userGetByRole } from '../../../../services/helperFunctions'
import './candidateFrom.scss'
import { Label } from 'reactstrap';

export const CandidateFrom = ({ sucessSaved = '', onClose = '', candidateEditObj }) => {
    const simpleValidator = useRef(new SimpleReactValidator({ className: "error-message", }));
    const [, forceUpdate] = useState();
    const [candidateObj, SetCandidateObj] = useState({ ...candidateFormObj });
    const [isFormLoader, setFormLoader] = useState(false);
    const [batchTimingList, setBatchTimingList] = useState([]);
    const [batchTimings, setBatchTiming] = useState([]);
    const [curseTrainerList, setCurseTrainerList] = useState([]);



    //onlode call
    useEffect(() => {
        handleGetBatchList();
        handleGetUserList();
    }, [])



    //handle input change function call start
    const handleInputChange = e => {
        let { value, name } = e.target;
        SetCandidateObj({
            ...candidateObj,
            [name]: value
        })

    };

    const handleInputJoinedCoursesChange = (e, i) => {
        let { value, name } = e.target;
        if (name != 'classDays') {
            candidateObj.joinedCourses[i][name] = value
        } else {
            value = Number(value)
            let index = candidateObj.joinedCourses[i][name].findIndex((data) => data === value);
            if (index == -1) {
                candidateObj.joinedCourses[i][name].push(value);
            } else {
                candidateObj.joinedCourses[i][name].splice(index, 1);
            }
        }
        SetCandidateObj({
            ...candidateObj
        });

    };


    useEffect(() => {
        if (!isEmpty(candidateEditObj)) {
            SetCandidateObj({ ...candidateFormObj, ...candidateEditObj })
        }
    }, [candidateEditObj]);



    const handleCreateClasss = () => {
        const formValid = simpleValidator.current.allValid();
        if (formValid) {
            simpleValidator.current.hideMessages();
            setFormLoader(true)
            let reqBody = Object.assign({}, candidateObj)
            reqBody.status = candidateObj?.joinedCourses?.map(({ status }) => status);
            reqBody.trainerIDs = candidateObj?.joinedCourses?.map(({ trainer }) => trainer);
            reqBody.classTimeIDs = candidateObj?.joinedCourses?.map(({ classTime }) => classTime);
            reqBody.branchIncharges = candidateObj?.joinedCourses?.map(({ branchIncharge }) => branchIncharge);

            reqBody.billMonths = candidateObj?.joinedCourses?.map(({ billMonth },i) => { 
                reqBody.joinedCourses[i].billMonth=billMonth?billMonth:"";
                return billMonth
            }).filter(Boolean);
            console.log('reqBody--------->',JSON.stringify(reqBody))
           
            let apiCall = candidateObj.hasOwnProperty("id") ? updateCandidate(reqBody, candidateObj.id) : createCandidate(reqBody)
            apiCall.then((data) => {
                setFormLoader(false);

                sucessSaved();
                SetCandidateObj({ ...candidateFormObj });

            }).catch((error) => {
                setFormLoader(false);

            });
        } else {
            simpleValidator.current.showMessages();
            forceUpdate(1);
        }
    }


    const handleTOCloseModal = () => {
        SetCandidateObj({ ...candidateFormObj });
        onClose()
    }

    const handleJoinCourses = () => {


        candidateObj.joinedCourses?.push({ ...joinedCoursesObj })
        SetCandidateObj({ ...candidateObj });
    }
    const handleJoinCoursesDelete = (i) => {
        candidateObj.joinedCourses?.splice(i, 1);
        SetCandidateObj({ ...candidateObj });

    }


    const handleGetBatchList = () => {
        try {
            getBatchList().then((data) => {
                let batchTimingList = data.map(({ batchTiming, id }) => ({ label: batchTiming, value: id }));
                console.log('data------------>',)
                setBatchTimingList(batchTimingList);
                setBatchTiming(data)

            }).catch((error) => {
                // setFormLoader(false);

            });

        } catch (e) {

        }
    };

    const handleGetUserList = () => {
        try {
            getAllUser().then((data) => {


                let userList = data.map(({ first_name, last_name, userId,user_type }) => ({ label: `${first_name} ${last_name}`, value: userId ,user_type}))


                setCurseTrainerList([...userList,{ label:'not assigned'}]);
            }).catch((error) => {
                // setFormLoader(false);

            });

        } catch (e) {

        }
    }



    return (

        <div className="row mt-2">
            <div className='col-md-12 col-sm-12'>
                <NormalInput label='Name'
                    onChange={handleInputChange}
                    value={candidateObj.name}
                    name='name'
                    errorMessage={simpleValidator.current.message('Name', candidateObj.name, 'required')} />
            </div>
            <div className='col-md-12 col-sm-12'>
                <NormalInput label='Email'
                    onChange={handleInputChange}
                    value={candidateObj.email}
                    name='email'
                    errorMessage={simpleValidator.current.message('Email', candidateObj.email, 'required|email')} />
            </div>
            <div className='col-md-12 col-sm-12'>
                <NormalInput label='Phone'
                    onChange={handleInputChange}
                    value={candidateObj.phone}
                    name='phone'
                    errorMessage={simpleValidator.current.message('Phone', candidateObj.phone, 'required|phone')} />
            </div>
            <div className='col-md-12 col-sm-12'>
                <NormalInput label='joinDate'
                    onChange={handleInputChange}
                    value={candidateObj.joinDate}
                    name='joinDate'
                    type="date"
                    errorMessage={simpleValidator.current.message('joinDate', candidateObj.joinDate, 'required')} />
            </div>

            <div className='col-md-12 col-sm-12 '>
                {candidateObj?.joinedCourses?.map((joinedCourses, i) =>
                    <div className='card mb-4' key={i}>
                        <div className='card-body'>
                            <div className='row'>
                                <div className='col-md-6 col-sm-12'>
                                    <Normalselect label='Course'
                                        onChange={(e) => handleInputJoinedCoursesChange(e, i)}
                                        value={joinedCourses.course}
                                        options={COURSE_LIST}
                                        name='course'
                                        errorMessage={simpleValidator.current.message('Course', joinedCourses.course, 'required')} />
                                </div>
                                <div className='col-md-6 col-sm-12'>
                                    <NormalInput label='Join Date'
                                        onChange={(e) => handleInputJoinedCoursesChange(e, i)}
                                        value={joinedCourses.courseStartDate}
                                        type="date"
                                        name='courseStartDate'
                                        errorMessage={simpleValidator.current.message('Phone', joinedCourses.courseStartDate, 'required')} />
                                </div>
                                <div className='col-md-6 col-sm-12'>
                                    <Normalselect label='Status'
                                        onChange={(e) => handleInputJoinedCoursesChange(e, i)}
                                        value={joinedCourses.status}
                                        options={CANDIDATE_COURSE_STATUS}
                                        name='status'
                                        errorMessage={simpleValidator.current.message('Status', joinedCourses.status, 'required')} />
                                </div>
                                <div className='col-md-6 col-sm-12'>
                                    <Normalselect label='Class Time'
                                        onChange={(e) => handleInputJoinedCoursesChange(e, i)}
                                        value={joinedCourses.classTime}
                                        options={batchTimingList}
                                        name='classTime'
                                        errorMessage={joinedCourses.status !== 'Yet to start' &&   simpleValidator.current.message('Class Time', joinedCourses.classTime, 'required')} />
                                </div>
                                <div className='col-md-6 col-sm-12'>
                                    {/* {joinedCourses.trainer} */}
                                    <Normalselect label='Trainer'
                                        onChange={(e) => handleInputJoinedCoursesChange(e, i)}
                                        value={joinedCourses?.trainer}
                                        options={userGetByRole(curseTrainerList,USER_ROLE.TRAINER) }
                                        name='trainer'
                                        disabled={!joinedCourses.classTime}
                                        errorMessage={joinedCourses.status !== 'Yet to start' &&   simpleValidator.current.message('Trainer', joinedCourses.trainer, 'required')} />
                                </div>

                                <div className='col-md-6 col-sm-12'>
                                    <Normalselect label='Class Type'
                                        onChange={(e) => handleInputJoinedCoursesChange(e, i)}
                                        value={joinedCourses.classType}
                                        options={CLASS_TYPE}
                                        name='classType'
                                        errorMessage={simpleValidator.current.message('Class Type', joinedCourses.classType, 'required')} />
                                </div>
                                <div className='col-md-6 col-sm-12'>
                                    <Normalselect label='Institute Branch'
                                        onChange={(e) => handleInputJoinedCoursesChange(e, i)}
                                        value={joinedCourses.instituteBranch}
                                        options={INSTITUTE_BRANCH}
                                        name='instituteBranch'
                                        errorMessage={simpleValidator.current.message('Institute Branch', joinedCourses.instituteBranch, 'required')} />
                                </div>
                                <div className='col-md-6 col-sm-12'>
                                    <NormalInput label='Total Fees'
                                        onChange={(e) => handleInputJoinedCoursesChange(e, i)}
                                        value={joinedCourses.fees}
                                        name='fees'
                                        errorMessage={simpleValidator.current.message('Total Fees', joinedCourses.fees, 'required|numeric')} />
                                </div>
                                <div className='col-md-6 col-sm-12'>
                                    <NormalInput label='Pending Fees'
                                        onChange={(e) => handleInputJoinedCoursesChange(e, i)}
                                        value={joinedCourses.pendingFees}
                                        name='pendingFees'
                                        errorMessage={simpleValidator.current.message('Pending Fees', joinedCourses.pendingFees, 'required|numeric')} />
                                </div>
                                {/* {joinedCourses.status === 'Completed' && */}
                                    <div className='col-md-6 col-sm-12'>
                                        <NormalInput label='Billing Month'
                                            onChange={(e) => handleInputJoinedCoursesChange(e, i)}
                                            value={joinedCourses.billMonth}
                                            name='billMonth'
                                            type='month'
                                            errorMessage={(joinedCourses.status === 'Completed' || joinedCourses.settlementStatus === 'Yes' ) && simpleValidator.current.message('Billing Month', joinedCourses.billMonth, 'required')} />
                                    </div>
                                <div className='col-md-6 col-sm-12'>
                                    <Normalselect label='Settlement Status'
                                        onChange={(e) => handleInputJoinedCoursesChange(e, i)}
                                        value={joinedCourses.settlementStatus}
                                        name='settlementStatus'
                                        options={YES_NO}
                                        errorMessage={simpleValidator.current.message('Settlement Status', joinedCourses.settlementStatus, 'required')} />
                                </div>
                                <div className='col-md-6 col-sm-12'>
                                    {/* {joinedCourses.trainer} */}
                                    <Normalselect label='Branch Incharge'
                                        onChange={(e) => handleInputJoinedCoursesChange(e, i)}
                                        value={joinedCourses?.branchIncharge}
                                        options={userGetByRole(curseTrainerList,USER_ROLE.BRANCH_INCHARGE) }
                                        name='branchIncharge'
                                        errorMessage={simpleValidator.current.message('Branch Incharge', joinedCourses.branchIncharge, 'required')} />
                                </div>

                                <div className='col-md-12 col-sm-12'>
                                    <div class="mb-3">
                                        <label className="form-label d-flex">Class Days</label>
                                        {WEEK_LIST?.map(({ label, value }) => <NormalCheckbox label={label} value={value} name='classDays' onChange={(e) => handleInputJoinedCoursesChange(e, i)} checked={joinedCourses.classDays.includes(value)} />)}
                                    </div>



                                </div>
                                <div className='col-md-12 col-sm-12 text-end'>
                                    {candidateObj?.joinedCourses.length === i + 1 && <a class="link-success add-delete-text me-2" onClick={handleJoinCourses}>Add New</a>}

                                    {candidateObj?.joinedCourses.length > 1 && <a onClick={() => handleJoinCoursesDelete(i)} class="link-danger add-delete-text">Delete</a>}

                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>







            <div className='col-md-12 col-sm-12'>
                <NormalButton disabled={isFormLoader} color='error' onClick={handleTOCloseModal} className='me-2' label='Cancel' />
                <NormalButton isLoader={isFormLoader} label={candidateObj.hasOwnProperty("id") ? "Update" : 'Save'} onClick={handleCreateClasss} />

            </div>
        </div>
    )




} 