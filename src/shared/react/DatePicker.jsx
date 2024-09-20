import { Box, Flex, Text, TextField } from '@radix-ui/themes';
import React, { useCallback, useEffect, useState } from 'react';

import { formatDate } from '../js/date';
import { add0 } from '../js/utils';
import { errorColor } from './AppWrapper.jsx';

export function DatePicker({ label, value, onChange }) {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [yearErrorMessage, setYearErrorMessage] = useState('');
  const [monthErrorMessage, setMonthErrorMessage] = useState('');
  const [dayErrorMessage, setDayErrorMessage] = useState('');

  useEffect(() => {
    if (value) {
      const dateString = formatDate(value);
      const parts = dateString.split('-');
      setYear(parts[0]);
      setMonth(parts[1]);
      setDay(parts[2]);
    }
  }, [value]);

  const isValidDay = useCallback(
    newValue => {
      const num = +newValue;
      if (num > 0 && num <= 28) {
        return true;
      }
      if (num === 29 || num === 30 || num === 31) {
        return (
          formatDate(new Date(`${+year}-${add0(+month)}-${add0(num)}`)) ===
          `${year}-${month}-${num}`
        );
      }
      return false;
    },
    [month, year]
  );

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (isValidYear(year) && isValidMonth(month) && isValidDay(day)) {
        onChange(new Date(`${+year}-${add0(+month)}-${add0(+day)}`));
      }
    }, 700);

    return () => clearTimeout(timerId);
  }, [year, month, day, isValidDay, onChange]);

  function isValidYear(newValue) {
    return +newValue > 0 && +newValue <= 9999;
  }

  function isValidMonth(newValue) {
    return +newValue > 0 && +newValue <= 12;
  }

  function setNewDate() {
    if (isValidYear(year) && isValidMonth(month) && isValidDay(day)) {
      onChange(new Date(`${+year}-${add0(+month)}-${add0(+day)}`));
    }
  }

  return (
    <Box>
      {!!label && <Text as="label">{label}</Text>}
      <Flex>
        <Box width="50px">
          <Text size="1" ml="8px">
            Year
          </Text>
          <TextField.Root
            placeholder="YYYY"
            value={year}
            onChange={e => {
              setYear(e.target.value);
              if (isValidYear(e.target.value)) {
                setYearErrorMessage('');
              } else {
                setYearErrorMessage('Invalid year');
              }
            }}
            onBlur={setNewDate}
            color={yearErrorMessage ? errorColor : undefined}
            radius="none"
            variant="soft"
          />
        </Box>
        <Box width="50px">
          <Text size="1" ml="8px">
            Month
          </Text>
          <TextField.Root
            placeholder="MM"
            value={month}
            onChange={e => {
              setMonth(e.target.value);
              if (isValidMonth(e.target.value)) {
                setMonthErrorMessage('');
              } else {
                setMonthErrorMessage('Invalid month');
              }
            }}
            onBlur={setNewDate}
            color={monthErrorMessage ? errorColor : undefined}
            radius="none"
            variant="soft"
          />
        </Box>
        <Box width="50px">
          <Text size="1" ml="8px">
            Day
          </Text>
          <TextField.Root
            placeholder="DD"
            value={day}
            onChange={e => {
              setDay(e.target.value);
              if (isValidDay(e.target.value)) {
                setDayErrorMessage('');
              } else {
                setDayErrorMessage('Invalid day');
              }
            }}
            onBlur={setNewDate}
            color={dayErrorMessage ? errorColor : undefined}
            radius="none"
            variant="soft"
          />
        </Box>
      </Flex>
    </Box>
  );
}
