import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      cityOrQuery = 'Hyderabad',
      serviceType = 'Hospital',
      lat,
      lng,
    } = req.body || {};

    const searchQuery = `${serviceType} in ${cityOrQuery}`;
    let osmFacilities: any[] = [];
    try {
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
        searchQuery
      )}&limit=6&addressdetails=1`;
      const osmRes = await fetch(nominatimUrl, {
        headers: {
          'User-Agent': 'HealthGuideAI-Navigator/1.0',
          Accept: 'application/json',
        },
      });
      if (osmRes.ok) {
        const osmData = await osmRes.json();
        if (Array.isArray(osmData)) {
          osmFacilities = osmData.map((place: any, idx: number) => {
            const name =
              place.name ||
              place.display_name?.split(',')[0] ||
              `${cityOrQuery} ${serviceType}`;
            const isGov =
              /government|govt|district|primary health|aiims|osmania|gandhi|kgh|civil|general hospital/i.test(
                name
              );
            return {
              id: `osm-${place.place_id || idx}`,
              name,
              type: serviceType,
              sector: isGov ? 'Government' : 'Private',
              city:
                place.address?.city ||
                place.address?.town ||
                place.address?.state_district ||
                cityOrQuery,
              address: place.display_name || cityOrQuery,
              phone: isGov ? '104 / 108 (Public Health Desk)' : 'Directory Verified Facility',
              services: [
                serviceType,
                'Outpatient & Triage Navigation',
                isGov ? 'Public Healthcare Scheme Support' : 'General Medical Services',
              ],
              openingHours:
                serviceType === 'Emergency Department' || serviceType === 'Hospital'
                  ? 'Open 24 Hours (Verify OPD timings locally)'
                  : '8:30 AM – 8:00 PM',
              isOpen24Hours:
                serviceType === 'Emergency Department' || serviceType === 'Hospital',
              isOpenNow: true,
              lat: parseFloat(place.lat) || lat || 17.385,
              lng: parseFloat(place.lon) || lng || 78.4867,
              mapUrl: `https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lon}#map=16/${place.lat}/${place.lon}`,
              source: 'OpenStreetMap Public Directory',
            };
          });
        }
      }
    } catch (osmErr) {
      console.warn('OpenStreetMap lookup warning:', osmErr);
    }

    let mapsGroundingLinks: { title: string; uri: string }[] = [];
    let aiSummary = '';

    if (process.env.GEMINI_API_KEY) {
      try {
        const toolConfig: any = {};
        if (typeof lat === 'number' && typeof lng === 'number') {
          toolConfig.retrievalConfig = {
            latLng: {
              latitude: lat,
              longitude: lng,
            },
          };
        }

        const mapsResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `List well-known ${serviceType} facilities in or near ${cityOrQuery}, including government hospitals and emergency departments, with their general location and services.`,
          config: {
            tools: [{ googleMaps: {} }],
            ...(Object.keys(toolConfig).length > 0 ? { toolConfig } : {}),
          },
        });

        aiSummary = mapsResponse.text || '';
        const chunks =
          mapsResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        for (const chunk of chunks as any[]) {
          if (chunk?.maps?.uri) {
            mapsGroundingLinks.push({
              title: chunk.maps.title || `${serviceType} – Google Maps`,
              uri: chunk.maps.uri,
            });
          }
        }
      } catch (mapsErr) {
        console.warn('Maps grounding fallback:', mapsErr);
      }
    }

    return res.status(200).json({
      facilities: osmFacilities,
      mapsGroundingLinks,
      aiSummary,
    });
  } catch (error: any) {
    console.error('Error in /api/services/live-search:', error);
    return res.status(500).json({
      error: error?.message || 'Unable to complete live healthcare directory search.',
    });
  }
}
