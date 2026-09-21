import Contact from "../../models/contact.model.js";

const contactResolvers = {

    createContact: async (args) => {

        try {

            const { fullname, email, number, message } = args;

            const contact = await Contact.create({
                fullname,
                email,
                number,
                message
            });
            console.log("CONTACT CREATED:", contact);
            return {
                message: "Contact created successfully",
                data: contact
            }            

        } catch (error) {            
            console.error("Error creating contact:", error);
            const errorMessage = error.errors && error.errors[0] ? error.errors[0].message : "An error occurred while creating the contact.";
            throw new Error(errorMessage);
        }

    }

};

export default contactResolvers;