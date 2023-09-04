import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Slider from 'react-slick';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import * as writeXLSX from 'xlsx';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './styles/month-logs.css';
import Lottie from 'react-lottie-player';
import circleOutlineAnimation from '../img/wired-outline-105-loader-1.json';  // Replace with the path to your downloaded Lottie file



function NextArrow(props) {
  const { buttonNext, style, onClick } = props;
  return (
    <div
      className={`${buttonNext} slick-next custom-arrow`} // add the slick-next class
      style={{ ...style, display: "block", backgroundColor: "gray" }}
      onClick={onClick}
    />
  );
}

function PrevArrow(props) {
  const { buttonPrev, style, onClick } = props;
  return (
    <div
      className={`${buttonPrev} slick-prev custom-arrow`} // add the slick-prev class
      style={{ ...style, display: "block", backgroundColor: "gray" }}
      onClick={onClick}
    />
  );
}




const MonthLogs = () => {

  const [sliderIndex, setSliderIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
  }

  const handleMouseLeave = () => {
    setIsHovering(false);
  }
  
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 2,
    initialSlide: 0,
    nextArrow: isHovering ? <NextArrow /> : null,
    prevArrow: isHovering ? <PrevArrow /> : null,  
    afterChange: (index) => setSliderIndex(index),   
  };



  const Menus = styled(Menu)(({ theme }) => ({
    '& .MuiPaper-root': {
      backgroundColor: "#0E2337",
      borderRadius: "1rem",
      boxShadow: 'none',
      
      
    },
    '& MuiList-root': {
      borderRadius: "1rem",
      fontFamily: 'Poppins',
    },
    
    fontFamily: 'Poppins',
  })
);
 

  
  const [anchorEl, setAnchorEl] = useState('');
  const [selectedMonthData, setSelectedMonthData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  
  const handleMenuClick = (event, month) => {
    setSelectedMonth(month);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  
  const handleClearData = () => {
    // handle clear data
  };

  
  const handleBackupData = () => {
  };
 

  const navigate = useNavigate();
  const [months, setMonths] = useState([
    { abbreviation: "January", name: "JANUARY", data: [], count: 0 },
    { abbreviation: "February", name: "FEBRUARY", data: [], count: 0 },
    { abbreviation: "March", name: "MARCH", data: [], count: 0 },
    { abbreviation: "April", name: "APRIL", data: [], count: 0 },
    { abbreviation: "May", name: "MAY", data: [], count: 0 },
    { abbreviation: "June", name: "JUNE", data: [], count: 0 },
    { abbreviation: "July", name: "JULY", data: [], count: 0 },
    { abbreviation: "August", name: "AUGUST", data: [], count: 0 },
    { abbreviation: "September", name: "SEPTEMBER", data: [], count: 0 },
    { abbreviation: "October", name: "OCTOBER", data: [], count: 0 },
    { abbreviation: "November", name: "NOVEMBER", data: [], count: 0 },
    { abbreviation: "December", name: "DECEMBER", data: [], count: 0 },
  ]);

 

  useEffect(() => {
    const fetchDataForAllMonths = async () => {
      const response = await fetch("/api/realm/monthdata");
      const data = await response.json();
      const monthCounts = {
        JANUARY: 0,
        FEBRUARY: 0,
        MARCH: 0,
        APRIL: 0,
        MAY: 0,
        JUNE: 0,
        JULY: 0,
        AUGUST: 0,
        SEPTEMBER: 0,
        OCTOBER: 0,
        NOVEMBER: 0,
        DECEMBER: 0,
      };

      // Count the number of data in each month
      data.forEach((param) => {
        const month = new Date(param.createdAt).toLocaleString("en-PH", { month: "long" }).toUpperCase();
        monthCounts[month]++;
      });

      // Merge the count with the data for each month
      const monthsWithData = months.map((month) => ({
        ...month,
        data: data.filter(
          (param) =>
            new Date(param.createdAt).toLocaleString("en-PH", { month: "long" }).toUpperCase() === month.name
        ),
        count: monthCounts[month.name],
      }));

      setMonths(monthsWithData);
    };

    fetchDataForAllMonths();
  }, []);


  let sharedFilteredData = [];
  
  
  const handleMonthClick = async (month, event) => {
    if (event.target.closest('.MuiIconButton-root') !== null) {
      return;
    }
    setSelectedMonth(month); // Also set the selected month here
    const response = await fetch(`/api/realm/monthdata`);
    const data = await response.json();
    const filteredData = data.filter(
      (param) =>
        new Date(param.createdAt).toLocaleString("en-PH", { month: "long" }).toUpperCase() === month.name
    );
    setSelectedMonthData(filteredData);
    navigate(`/Logs/RecordTable/${month.abbreviation}`, { state: { data: filteredData } });
  }
  

  const handleExportData = async () => {
    console.log("Export Data Clicked"); // Just to confirm this function is being triggered

    // Fetch the data for the selected month
    const response = await fetch(`/api/realm/monthdata`);
    const data = await response.json();
    const filteredData = data.filter(
      (param) =>
        new Date(param.createdAt).toLocaleString("en-PH", { month: "long" }).toUpperCase() === selectedMonth.name
    );
  
    // Map the filtered data to match the CSV fields
    const mappedData = filteredData.map(({ id, sensor, type, value, status, createdAt }) => ({
        id,
        sensor,
        type,
        value: Array.isArray(value) ? value.join(', ') : value,
        status,
        createdAt: new Date(createdAt).toLocaleString('en-PH', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        }),
    }));
  
    // Initialize the workbook
    const wb = writeXLSX.utils.book_new();
  
    // Filter the data by parameter type and create separate sheets for each parameter\
    const tempData = mappedData.filter(({ type }) => type === 'temperature');
    const turbidData = mappedData.filter(({ type }) => type === 'turbidity');
    const phData = mappedData.filter(({ type }) => type === 'pH');
  
    const tempSheet = writeXLSX.utils.json_to_sheet(tempData);
    const turbidSheet = writeXLSX.utils.json_to_sheet(turbidData);
    const phSheet = writeXLSX.utils.json_to_sheet(phData);
  
    // Add the sheets to the workbook
    writeXLSX.utils.book_append_sheet(wb, tempSheet, 'Temperature');
    writeXLSX.utils.book_append_sheet(wb, turbidSheet, 'Turbidity');
    writeXLSX.utils.book_append_sheet(wb, phSheet, 'pH');
  
    // Convert the workbook to a binary string
    const wbout = writeXLSX.write(wb, { type: 'binary', bookType: 'xlsx' });
  
    // Download the workbook as an Excel file
    const fileName = `${selectedMonth.name.toLowerCase()}_logs.xlsx`;
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
  
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  
    // Convert binary string to array buffer
    function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
        return buf;
    }
}


    return(
      
      <div className="month-logs" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Slider {...settings}>
        {months.map((month) => (
          <div
            key={month.abbreviation}
            onClick={month.data && month.data.length > 0 ? (e) => handleMonthClick(month, e) : null}
            className={`monthly-logs ${!month.data || month.data.length === 0 ? 'disabled-month' : ''}`}
            role="button"
            onKeyDown={month.data && month.data.length > 0 ? (e) => handleMonthClick(month, e) : null}
            tabIndex={0}
            style={{ pointerEvents: month.data && month.data.length > 0 ? 'auto' : 'none' }}
          >
                    
                    <div style={{ width: '200px' }}>
                      <div className="months" 
                          style={{ display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center'}}>

                            {month.data && month.data.length > 0 ? (
                              <div className='reading-count' style={{fontWeight:'600', 
                                                                      fontSize: '2.3rem',
                                                                      marginTop: '2rem'}}>
                                  {month.data.length}
                              </div>
                              ) : (
                              <div className='no-readings' style={{marginTop: '1.5rem'}}>
                                      <Lottie
                                      animationData={circleOutlineAnimation}
                                      play
                                      loop
                                      style={{ width: 40, height: 40, margin: 'auto' }}  // Adjust the width and height as needed
                                    />
                              </div>
                              )}
                      </div>

                      <div style={{marginTop: '3rem', marginRight: '1rem', textAlign: 'left'}}>
                          <div className="month" style={{ display: 'flex', 
                                                          flexDirection: 'column',
                                                          lineHeight: '0.9'}} >
                              <span> {month.name} </span>
                              <span className="logs"> LOGS </span> {/* display the count of data for the month */}
                          </div>
                      </div>
                    </div> 

                    <Menus 
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleMenuClose}
                          
                        >
                          <MenuItem style={{color: 'white', fontFamily: 'Poppins'}} onClick={handleClearData}><span style={{padding:'0.7rem'}}> Clear Data </span></MenuItem>
                          <MenuItem style={{color: 'white', fontFamily: 'Poppins'}}
                                    onClick={(e) => {
                                    e.stopPropagation(); // prevent event bubbling to handleMonthClick
                                    handleExportData();
                                    }}><span style={{padding:'0.7rem'}}> Export Data </span> </MenuItem>
                          <MenuItem style={{color: 'white', fontFamily: 'Poppins'}} onClick={handleBackupData}><span style={{padding:'0.7rem'}}> Backup Data </span> </MenuItem>
                      </Menus>
                                  
                    <div className="buttomCon"
                          style={{ display: 'flex', gap: '2rem', marginLeft: '-2rem',
                          width: '292px', height: '75px',
                          flexDirection: 'row', padding: '0 2ch',backgroundColor: '#66B2FF', 
                          borderBottomLeftRadius: '1.6rem', borderBottomRightRadius: '1.6rem',
                          alignItems:'center', bottom: '0',
                          position: 'absolute'}}>

                       <div style={{ display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginLeft: "3px",
                        color: "#ffffff", }}>
                        {month.data && month.data.length > 0 ? 'Active' : 'Offline'}
                      
                      
                        <span >
                          <IconButton
                              onClick={(e) => handleMenuClick(e, month)}
                              sx={{
                                fontSize: 25,
                                color: '#e3f2fd',
                                display: 'flex',
                                marginLeft: '13rem'
                              }}
                              disabled={!month.data || month.data.length === 0}>
                              <MoreHorizIcon sx={{ fontSize: 25, color: '#e3f2fd', display: 'flex'}} />
                          </IconButton>
                        </span>
                        
                      </div>
                    </div>
              </div>
            ))}
          </Slider>            
          
        </div>
    )
}
export default MonthLogs