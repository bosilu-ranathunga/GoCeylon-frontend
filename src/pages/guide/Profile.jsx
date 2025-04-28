import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/config';
import TopAppBar from '../../components/TopAppBarGuide';
import BottomTabBar from '../../components/BottomTabBarGuide';
import { Link } from 'react-router-dom';


export default function Profile() {

  return (
    <div className='container mx-auto p-6 mt-[4rem] bg-gray-100 min-h-screen'>
      <TopAppBar />
      <div>
        profile
      </div>
      <BottomTabBar />
    </div >
  );
}
