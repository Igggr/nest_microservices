import { ApiProperty } from "@nestjs/swagger";

export class Token {
    @ApiProperty({
        description: 'Jwt-токен',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IlZhbkBtYWlsLmNvbSIsImlkIjoxLCJyb2xlcyI6WyJVU0VSIiwiQURNSU4iXSwiaWF0IjoxNjgwMjY0MzI1LCJleHAiOjE2ODAzNTA3MjV9.i8AScsAy3CC0KzfAKV-GF5hiQwBgftHjx8lGxWmCy7w'
    })
    token: string;
};