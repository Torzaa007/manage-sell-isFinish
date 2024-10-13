import { json } from '@sveltejs/kit';
import Database from 'better-sqlite3';
import path from 'path';
import { generateSQLQuery } from '$lib/utils.js';
import { onMount } from 'svelte';

  let selectedLine = '';
  let origin = '';
  let destination = '';
  let selectedDate = '';
  let allStations = [];
  let trips = [];
  let isLoading = false;
  let errorMessage = '';
  let noTrips = false;

  let originStationName = '';
  let destinationStationName = '';

  function updateStationNames() {
    const originStation = allStations.find(station => station.station_id === origin);
    const destinationStation = allStations.find(station => station.station_id === destination);

    originStationName = originStation ? originStation.station_name : 'ไม่ระบุ';
    destinationStationName = destinationStation ? destinationStation.station_name : 'ไม่ระบุ';
  }

  function formatDateTime(dateTime, onlyDate = false) {
    const date = new Date(dateTime);
    const formattedDate = date.toLocaleDateString('th-TH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    
    if (onlyDate) {
      return formattedDate;
    }
    
    const formattedTime = date.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
    }).replace(':', '.');

    return `${formattedTime} น. (${formattedDate})`;
  }

  $: origin, destination, updateStationNames();

  onMount(async () => {
    await fetchStations();
  });

  async function fetchStations() {
    const response = await fetch('/search/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ line: selectedLine }),
    });

    const result = await response.json();
    allStations = result.stations;
  }

  async function handleLineChange() {
    origin = '';
    destination = '';
    trips = [];
    await fetchStations();
  }

  async function searchTrips() {
    isLoading = true;
    errorMessage = '';
    noTrips = false;

    if (!selectedDate) {
      errorMessage = 'กรุณาเลือกวันที่เดินทาง';
      isLoading = false;
      return;
    }

    const response = await fetch('/search/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        line: selectedLine,
        origin,
        destination,
        date: selectedDate,
      }),
    });

    const result = await response.json();

    if (result.error) {
      errorMessage = result.error;
      trips = [];
      isLoading = false;
      return;
    }

    trips = result.trips || [];

    if (trips.length === 0) {
      noTrips = true;
    }

    isLoading = false;
  }

  async function bookTrip(trip) {
    const formData = new FormData();
    formData.append('tripId', trip.trip_id);
    formData.append('tripName', trip.trip_name);
    formData.append('startStation', trip.start_name);
    formData.append('endStation', trip.end_name);
    formData.append('date', trip.from_datetime);
    formData.append('user_from_station', originStationName);
    formData.append('user_to_station', destinationStationName);


    const response = await fetch('/reservation', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      window.location.href = '/reservation';
    } else {
      console.error('Error saving trip to session');
    }
  }
export async function POST({ request }) {
  const { line, origin, destination, date } = await request.json();

  const dbPath = path.resolve('src/database/dbforTrain.db');
  const db = new Database(dbPath);

  try {
    if (!origin && !destination) {
      let stationsQuery = `SELECT station_id, station_name FROM STATIONS`;
      if (line) {
        stationsQuery += ` WHERE station_id LIKE '%_${line.toLowerCase()}_%'`;
      }
      const allStations = db.prepare(stationsQuery).all();
      return json({ stations: allStations });
    }

    if (origin && destination && date) {
      const tripsQuery = generateSQLQuery(origin, destination, date);
      const trips = db.prepare(tripsQuery).all();
      return json({ trips });
    }

    if (!date) {
      return json({ error: 'กรุณาเลือกวันที่เดินทาง' }, { status: 400 });
    }

    return json({ error: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching data:', error);
    return json({ stations: [], trips: [], error: 'ไม่สามารถดึงข้อมูลจากฐานข้อมูลได้' }, { status: 500 });
  } finally {
    db.close();
  }
}