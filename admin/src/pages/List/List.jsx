import React, { useEffect, useState } from 'react'
import './List.css'
import axios from 'axios';
import { toast } from 'react-toastify';

const List = ({url}) => {
  const [list,setList] = useState([]);
  const fetchList = async() => {
    const response = await axios.get(`${url}/api/food/list`);
    console.log(response.data);
    
    if(response.data.success){
      setList(response.data.data);
    }else{
      toast.error("Error");
    }
  }

  const removeFood = async(foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, { id:foodId });
    await fetchList();
    if(response.data.success){
      toast.success("Food removed successfully");
    }else{
      toast.error("Error removing food");
    }
  }

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Price</b>
          <b>Category</b>
          <b>Action</b>
        </div>
        {
          list.map((item,index) => {
            return(
              <div key={index} className='list-table-format'>
                  <img src={`${url}/images/`+item.image} />
                  <p>{item.name}</p>
                  <p>{item.price}</p>
                  <p>${item.category}</p>
                  <p className='cursor' onClick={() => removeFood(item._id)}>X</p>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default List