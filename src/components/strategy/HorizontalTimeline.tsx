import React from 'react';
import { 
  Box, 
  Typography, 
  Chip,
  Stack,
  useTheme
} from '@mui/material';
import { format, addMonths } from 'date-fns';

interface TimelineEvent {
  date: Date;
  label: string;
  description: string;
  amount?: string;
  type: 'buy' | 'sell' | 'settle' | 'loan' | 'debt';
}

interface HorizontalTimelineProps {
  events: TimelineEvent[];
  startDate: Date;
  endDate: Date;
}

export const HorizontalTimeline: React.FC<HorizontalTimelineProps> = ({
  events,
  startDate,
  endDate
}) => {
  const theme = useTheme();
  
  // Calculate position of event on timeline (0-100%)
  const getEventPosition = (eventDate: Date): number => {
    const totalDuration = endDate.getTime() - startDate.getTime();
    const eventOffset = eventDate.getTime() - startDate.getTime();
    return (eventOffset / totalDuration) * 100;
  };

  const getChipColor = (type: string) => {
    switch (type) {
      case 'buy':
        return theme.palette.primary.main;
      case 'sell':
        return theme.palette.secondary.main;
      case 'settle':
        return theme.palette.info.main;
      case 'loan':
        return theme.palette.warning.main;
      case 'debt':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  return (
    <Box sx={{ position: 'relative', pt: 4, pb: 6 }}>
      {/* Timeline track */}
      <Box
        sx={{
          position: 'absolute',
          top: 28,
          left: 0,
          right: 0,
          height: 2,
          backgroundColor: '#e0e0e0',
          borderRadius: 1
        }}
      />
      
      {/* Progress fill */}
      {events.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            top: 28,
            left: `${getEventPosition(events[0].date)}%`,
            width: `${getEventPosition(events[events.length - 1].date) - getEventPosition(events[0].date)}%`,
            height: 2,
            backgroundColor: theme.palette.primary.main,
            borderRadius: 1
          }}
        />
      )}

      {/* Events */}
      {events.map((event, index) => {
        const position = getEventPosition(event.date);
        
        return (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              left: `${position}%`,
              transform: 'translateX(-50%)',
              top: 0
            }}
          >
            {/* Event marker dot */}
            <Box
              sx={{
                position: 'absolute',
                top: 24,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: getChipColor(event.type),
                border: '2px solid white',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                zIndex: 1
              }}
            />
            
            {/* Date chip */}
            <Chip
              label={format(event.date, 'MMM yyyy')}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.75rem',
                fontWeight: 500,
                backgroundColor: getChipColor(event.type),
                color: 'white',
                '& .MuiChip-label': {
                  px: 1
                }
              }}
            />
            
            {/* Event details below timeline */}
            <Box sx={{ mt: 3, minWidth: 120, textAlign: 'center' }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'text.primary',
                  lineHeight: 1.2,
                  mb: 0.5
                }}
              >
                {event.description}
              </Typography>
              {event.amount && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: '0.75rem',
                    color: 'text.secondary',
                    lineHeight: 1.2
                  }}
                >
                  {event.amount}
                </Typography>
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};