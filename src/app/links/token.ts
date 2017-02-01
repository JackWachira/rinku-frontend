export class Token {
  constructor(
    public access_token: String,
    public scope: any,
    public user: any,
    public team: any,
  ) { }
}