import React from 'react'
import Youtube from "./Youtube"; 
import DownloaderBox from '../components/DownloaderBox';
import { FeaturesSection } from '../components/FeatureSection';
import { FaqSection } from '../components/FaqSection';


export default function Home() {
  return (
    <>
    <DownloaderBox/>

    <FeaturesSection/>

    <FaqSection/>
    </>
  
  )
}
