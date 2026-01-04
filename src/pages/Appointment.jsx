import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import RelatedDoctors from './RelatedDoctors'
import { toast } from 'react-toastify'
import axios from 'axios'

const Appointment = () => {

  const { docID } = useParams()
  const {doctors, currencySymbol, backendUrl, token, getDoctorsData} = useContext(AppContext)

  const navigate = useNavigate()
  const [docId, setDocId] = useState(null)

  const [docslots, setDocslots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')
 

  const appoitdetail = async() => {
     const docInfo = doctors.find(doc=> doc._id === docID);
     setDocId(docInfo)
    }
    
const getAvailableSlots = async () => {
  setDocslots([]);

  let today = new Date();

  for (let i = 0; i < 7; i++) {
    let currentDate = new Date(today);
    currentDate.setDate(today.getDate() + i);

    let endTime = new Date(today);
    endTime.setDate(today.getDate() + i);
    endTime.setHours(21, 0, 0, 0);

    if (today.getDate() === currentDate.getDate()) {
      let hours = currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10;
      let minutes = currentDate.getMinutes() > 30 ? 30 : 0;
      currentDate.setHours(hours, minutes, 0, 0);
    } else {
      currentDate.setHours(10, 0, 0, 0);
    }

    let timeSlots = [];

    while (currentDate < endTime) {
      let formattedTime = currentDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });


      let day = currentDate.getDate()
      let month = currentDate.getMonth()+1
      let year = currentDate.getFullYear()
      
      const slotDate = day +"_" + month + "_" + year
      const slotTime = formattedTime

      const isSlotAvailable = docId.slote_booked[slotDate] && docId.slote_booked[slotDate].includes(slotTime) ? false : true

      if (isSlotAvailable) {
        timeSlots.push({
        datetime: new Date(currentDate),
        time: formattedTime,
      });
      }


      

      currentDate.setMinutes(currentDate.getMinutes() + 30);
    }

    setDocslots((prev) => [...prev, timeSlots]);
  }
};

const bookapointment = async () => {
        if (!token) {
          toast.warn('Login to book appointment')
          return navigate('/login')
        }

        try {

          const date = docslots[slotIndex][0].datetime
           
          let day = date.getDate()
          let month = date.getMonth()+1
          let year = date.getFullYear()

          const slotDate = day +"_" + month + "_" + year

          const {data} = await axios.post(backendUrl + '/api/user/book-appointment', {docId, slotDate, slotTime}, {headers: {token}})
          console.log(data);
          
          if (data.success) {
            toast.success(data.message)
            getDoctorsData()
            navigate('/my-appointments')
          } else {
            toast.error(data.message)
          }
          console.log(slotDate);
          
        } catch (error) {
          console.log(error)
          toast.error(error.message)
        }
    }

    useEffect(()=>{
      appoitdetail();
    },[docID,doctors])
    

     useEffect(()=>{
      getAvailableSlots();
    },[docId])

    useEffect(()=> {
      console.log(docslots);
    },[docslots])

  return  docId && (
    <div>
       {/* --------Doctor Details --------- */}
       <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docId.image} alt="" />
        </div>

        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          {/* ---------- Doc Info : name, degree, experience ----------- */}
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>{docId.name} 
            <img className='w-5 mt-1' src={assets.verified_icon} alt="" />
          </p>
          <div className='flex items-center gap-2 text-sm mt-2 text-gray-600'>
            <p>{docId.degree} - {docId.speciality}</p>
            <button className='p-0.5 px-2 border text-xs rounded-full'>{docId.experience}</button>
          </div>

          {/* -------- Doctor About -------- */}
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
              About 
              <img src={assets.info_icon} alt="" />
            </p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docId.about}</p>
          </div>
          <p className='text-gray-500 font-medium mt-4'>
            Appointment fee: <span className='text-gray-600'>{currencySymbol}{docId.fees}</span>
          </p>
        </div>
       </div>


       {/* -------- Booking slots -------- */}
       <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
          <p>Booking slots</p>
          <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
            {
            docslots.length && docslots.map((item,index)=>(
              <div onClick={()=>setSlotIndex(index)} key={index} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`}>
               
               <p>{item[0] && item[0].datetime.toLocaleDateString('en-US',{weekday:'short'})}</p>
               <p>{item[0] && item[0].datetime.getDate()}</p>
              </div>
            ))
             }
          </div>

          <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
            {docslots.length && docslots[slotIndex].map((item,index)=>(
              <p onClick={()=>setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`} key={index}>
                {item.time}
              </p>
            ))}
          </div>
          <button onClick={bookapointment} className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6 cursor-pointer'>Book an appointment</button>
       </div>

       {/* listing Related Doctors */}
       <RelatedDoctors docID={docID} speciality={docId.speciality}/>
    </div>
  )
}

export default Appointment
