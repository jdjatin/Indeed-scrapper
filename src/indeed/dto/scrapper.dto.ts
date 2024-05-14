import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ScrapperDto {

    @ApiProperty({default:"part-time-job"})
    jobTitle:string;

    @ApiProperty({default:"toronto,on"})
    location:string

    @ApiPropertyOptional({default:5})
    numberOfPages:number

    // @ApiPropertyOptional({default:true})
    // sortByDate:boolean

}