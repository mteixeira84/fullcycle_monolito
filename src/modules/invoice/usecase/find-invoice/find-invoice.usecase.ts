import InvoiceGateway from "../../gateway/invoice.gateway";
import {
  FindInvoiceUseCaseInputDTO,
  FindInvoiceUseCaseOutputDTO,
} from "./find-invoice.dto";

export default class FindInvoiceUseCase {
  private _invoiceRepository: InvoiceGateway;

  constructor(_invoiceRepository: InvoiceGateway) {
    this._invoiceRepository = _invoiceRepository;
  }

  async execute(
    input: FindInvoiceUseCaseInputDTO
  ): Promise<FindInvoiceUseCaseOutputDTO> {
    const invoice = await this._invoiceRepository.find(input.id);

    return {
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      address: {
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipCode: invoice.address.zipCode,
      },
      items: invoice.items.map((item) => {
        return { id: String(item.id), name: item.name, price: item.price };
      }),
      total: invoice.items.reduce((sum, item) => sum + item.price, 0),
      createdAt: invoice.createdAt,
    };
  }
}
