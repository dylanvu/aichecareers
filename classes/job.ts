export class Job {
    // https://www.tutorialsteacher.com/typescript/typescript-interface
    title: string;
    link: string;
    company: string;
    internship: boolean;

    constructor(newTitle: string, newLink: string, newCompany: string, isInternship: boolean) {
        this.title = newTitle;
        this.link = newLink;
        this.company = newCompany;
        this.internship = isInternship;
    }
}