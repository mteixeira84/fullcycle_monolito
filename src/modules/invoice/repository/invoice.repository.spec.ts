import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";
import InvoiceItemsModel from "./invoice-items.model";
import InvoiceItems from "../domain/invoice-items.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceRepository from "./invoice.repository";
import Address from "../../@shared/domain/value-object/address";
import Invoice from "../domain/invoice.entity";

describe("Invoice repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, InvoiceItemsModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a invoice", async () => {
    const invoiceProps = {
      id: new Id("123"),
      name: "Client 1",
      document: "Document 1",
      address: new Address(
        "Street 1",
        "Number 1",
        "Complement 1",
        "City 1",
        "State 1",
        "Zip Code 1"
      ),
      items: [
        new InvoiceItems({
          id: new Id("1"),
          name: "Product 1",
          price: 100,
        }),
        new InvoiceItems({
          id: new Id("2"),
          name: "Product 2",
          price: 200,
        }),
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const invoice = new Invoice(invoiceProps);
    const invoiceRepository = new InvoiceRepository();

    await invoiceRepository.generate(invoice);

    const invoiceDb = await InvoiceModel.findOne({
      where: { id: invoiceProps.id.id },
      include: [{ model: InvoiceItemsModel }],
    });

    expect(invoiceProps.id.id).toEqual(invoiceDb.id);
    expect(invoiceProps.name).toEqual(invoiceDb.name);
    expect(invoiceProps.document).toEqual(invoiceDb.document);
    expect(invoiceProps.address.street).toEqual(invoiceDb.street);
    expect(invoiceProps.address.number).toEqual(invoiceDb.number);
    expect(invoiceProps.address.complement).toEqual(invoiceDb.complement);
    expect(invoiceProps.address.city).toEqual(invoiceDb.city);
    expect(invoiceProps.address.state).toEqual(invoiceDb.state);
    expect(invoiceProps.address.zipCode).toEqual(invoiceDb.zipCode);
    expect(invoiceProps.createdAt).toStrictEqual(invoiceDb.createdAt);
    expect(invoiceProps.updatedAt).toStrictEqual(invoiceDb.updatedAt);
    expect(invoiceProps.items.length).toEqual(invoiceDb.items.length);
  });

  it("should find a invoice", async () => {
    const invoiceRepository = new InvoiceRepository();

    await InvoiceModel.create(
      {
        id: "123",
        name: "Client 1",
        document: "Document 1",
        street: "Street 1",
        number: "Number 1",
        complement: "Complement 1",
        city: "City 1",
        state: "State 1",
        zipCode: "Zip Code 1",
        items: [
          new InvoiceItemsModel({
            id: "1",
            name: "Product 1",
            price: 100,
          }),
          new InvoiceItemsModel({
            id: "2",
            name: "Product 2",
            price: 200,
          }),
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        include: [{ model: InvoiceItemsModel }],
      }
    );

    const invoice = await invoiceRepository.find("123");

    console.log(invoice.items);

    expect(invoice.id.id).toEqual("123");
    expect(invoice.name).toEqual("Client 1");
    expect(invoice.document).toEqual("Document 1");
    expect(invoice.address.street).toEqual("Street 1");
    expect(invoice.address.number).toEqual("Number 1");
    expect(invoice.address.complement).toEqual("Complement 1");
    expect(invoice.address.city).toEqual("City 1");
    expect(invoice.address.state).toEqual("State 1");
    expect(invoice.address.zipCode).toEqual("Zip Code 1");
    expect(invoice.items.length).toEqual(2);
  });
});
