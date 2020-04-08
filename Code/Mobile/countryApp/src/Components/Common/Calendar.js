import React, { Component } from 'react';
import CalendarStrip from 'react-native-calendar-strip';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

let datesBlacklist = [{
    start: moment('1950-01-01', 'YYYY-MM-DD'), 
    end: moment().subtract(1, 'days') 
  }];

class Calendar extends Component {
    
    render() {
        return(
            <CalendarStrip
                    {...this.props}
                    calendarAnimation={{ type: 'sequence', duration: 60 }}
                    daySelectionAnimation={{
                    type: 'background',
                    duration: 60,
                    highlightColor: 'white'
                    }}
                    calendarColor={'#1e90ff'}
                    style={{ height: 115, paddingTop: 10, paddingBottom: 10 }} //main container
                    calendarHeaderContainerStyle={{ paddingBottom: 10 }} // mes y año container
                    calendarHeaderStyle={{ color: 'white' }} // mes y año text
                    dateNameStyle={{ color: 'white' }}
                    dateNumberStyle={{ color: 'white' }}
                    highlightDateNameStyle={{ color: '#1e90ff' }}
                    highlightDateNumberStyle={{ color: '#1e90ff' }}
                    disabledDateNameStyle={{ color: '#EDF2F4' }}
                    disabledDateNumberStyle={{ color: '#EDF2F4' }}
                    maxDayComponentSize={60}
                    datesBlacklist={datesBlacklist}
                    iconContainer={{ flex: 0.1 }}
                    leftSelector={
                    <Ionicons name="ios-arrow-back" color="white" size={25} />
                    }
                    rightSelector={
                    <Ionicons name="ios-arrow-forward" color="white" size={25} />
                    }
                />
        )
    }
}

export default Calendar