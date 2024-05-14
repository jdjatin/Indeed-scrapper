import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Render } from '@nestjs/common';
import { IndeedService } from './indeed.service';
import { ScrapperDto } from './dto/scrapper.dto';
import axios from 'axios';
import { LocationStorageService } from './location.storage';


@Controller('indeed')
export class IndeedController {

    constructor(
        private readonly indeedService:IndeedService,
        private readonly locationStorageService: LocationStorageService

    ){}



    @Post('scrape')
    @HttpCode(HttpStatus.OK)
    async scrapeJob(@Body() scrappingData: ScrapperDto): Promise<{ url: string }> {
      const jobs = await this.indeedService.scrapeJobListings(scrappingData);
      
      const locations = [];
      console.log("Searching locations on google map, this may take time if number pf pages scrapped are more")
      for (const job of jobs) {
          try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(job.companyName + ' ' + job.location)}&key=${process.env.GOOGLE_MAPS_API_KEY}`);
              if (response.data.results.length > 0 && response.data.results[0].geometry && response.data.results[0].geometry.location) {
                // console.log(response.data.results)
                  const { lat, lng } = response.data.results[0].geometry.location;
                  if (lat && lng) {
                  //   console.log({
                  //     lat,
                  //     lng,
                  //     companyName: job.companyName,
                  //     location: job.companyName+" " +job.location
                  // })
                      locations.push({
                          lat,
                          lng,
                          companyName: job.companyName,
                          location: job.companyName+ " "+job.location,
                          jobTitle: job.jobTitle, 
                      datePosted: job.datePosted 
                      });
                  }
              }
          } catch (error) {
              console.error(`Failed to geocode location for ${job.companyName} at ${job.location}`, error);
              // Optionally continue to the next job or handle the error as needed
          }
      }
  
      this.locationStorageService.setLocationData(locations);
      console.log("Locations sucessfully mapped.")
  
      return { url: 'http://localhost:3000/api/indeed/map' };
    }

  @Get('map')
  @Render('maps')
  getMap() {
    const locations = this.locationStorageService.getLocationData();
    
    return { locations: JSON.stringify(locations), apiKey: process.env.GOOGLE_MAPS_API_KEY };
  }


}
